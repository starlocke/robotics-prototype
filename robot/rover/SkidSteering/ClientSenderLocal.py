#!/usr/bin/env python3

# make sure that you start ServerListener.py process on odroid first before running this script!

import sys
from socket import socket, AF_INET, SOCK_DGRAM, gethostbyname # add SOCK_STREAM here for TCP
import time
import os
import subprocess
import re
import click

# returns current time in milliseconds
currentMillis = lambda: int(round(time.time() * 1000))

# get original delay and refresh, in case not 500, 33
def getOriginalDelayAndRefresh():
    if os.name == "posix":
        xsetOutput = subprocess.run(['xset', '-q'], stdout=subprocess.PIPE)
        xsetConfig = xsetOutput.stdout.decode()
        lines = xsetConfig.splitlines() # delimit by newline into array
        delayAndRefreshStr = "empty"

        # get the specific line we are looking for
        for line in lines:
            if "delay" in line:
                delayAndRefreshStr = line

        xsetVals = re.findall(r'\d+', delayAndRefreshStr)
        originalDelay = xsetVals[0]
        originalRefresh = xsetVals[1]

        #setX = 'xset r rate ' + str(TARGET_DELAY) + ' ' + str(TARGET_REFRESH)
        #subprocess.Popen(setX.split())

        return (originalDelay, originalRefresh)

# set delay and refresh rate using UNIX xset
def setX(delay, refresh):
    setXCmd = 'xset r rate ' + str(delay) + ' ' + str(refresh)
    print("\nSetting delay rate to {} and refresh rate to {} ...".format(delay, refresh))
    subprocess.Popen(setXCmd.split())

# get my own IP address
def getMyIP():
    ifconfigOutput = subprocess.run(['ifconfig'], stdout=subprocess.PIPE)
    ifconfig = ifconfigOutput.stdout.decode()
    lines = ifconfig.splitlines() # delimit by newline into array
    myIpAddress = ""

    for line in lines:
        testLine = line.lower()
        if ("inet addr" in testLine and "bcast" in testLine) \
        or ("inet" in testLine and "broadcast" in testLine) and not "127.0.0.1" in testLine:
            print("line: " + line)
            myIpAddress = re.findall(r'\d+\.\d+\.\d+\.\d+', line)[0]

    return "127.0.0.1"

CLIENT_PORT = 5000
SERVER_PORT = 5001
SIZE = 1024

if len(sys.argv) < 2:  # first one is the name of the file
    print(
        "please pass a destination ip address/port of the listener to send this message to, port is optional and will default to 5000"
    )
    print("example usage: python ClientSender.py <ip of odroid> <optional port number, default: 5000>")
    sys.exit(1)

if len(sys.argv) == 3:
    CLIENT_PORT = int(sys.argv[2])
elif len(sys.argv) > 3:
    print("too many args")
    sys.exit(1)

SERVER_IP = sys.argv[1]

print(
    "Base station client sending command packets ('w' or 's') to IP {}, via port {}\nPress q to terminate connection.".
    format(SERVER_IP, CLIENT_PORT))

# use xset to set refresh/delay rates of keyboard input to something reasonable
TARGET_DELAY = 100
TARGET_REFRESH = 60
# these values are default on ubuntu 16.04
originalDelay = 500
originalRefresh = 33
# get original xset delay and refresh values
originalXsetVals = getOriginalDelayAndRefresh()
originalDelay = originalXsetVals[0]
originalRefresh = originalXsetVals[1]

hostName = gethostbyname('0.0.0.0')
# UDP socket for sending drive cmds
mySocket = socket(AF_INET, SOCK_DGRAM)
# make socket reachable by any address (rather than only visible to same machine that it's running on)
mySocket.bind((hostName, CLIENT_PORT))

# for controlling command throughput
lastCmdSent = 0
THROTTLE_TIME = 100
ACK_TIMEOUT = 2000
RESPONSE_TIMEOUT = 1000

# for sending IP/receiving acknowledgment
handshake = ""
IP_KNOWN = "ip_known" # acknowledgment message
clientIP = "ip:" + getMyIP() # format -> ip:192.168.2.13

# send client IP address over to server for feedback
print("Attempting to send: \"" + clientIP + "\" ...")
mySocket.sendto(str.encode(clientIP), (SERVER_IP, SERVER_PORT))
print("IP address sent\n")
#time.sleep(1)

print("Listening for acknowledgement from server ...")
# listen (right away) for incoming acknowledgement
acknowledgeTime = currentMillis()
handShakeSuccess = False
while currentMillis() - acknowledgeTime < ACK_TIMEOUT:
    try:
        (handshake, addr) = mySocket.recvfrom(SIZE)
        handshake = handshake.decode()
        print("Acknowledgment received: " + str(handshake) + "\n")
        if handshake == IP_KNOWN:
            handShakeSuccess = True
            break
    except:
        continue

if not handShakeSuccess:
    print("Reached acknowledgment timeout, closing.\n")
    setX(originalDelay, originalRefresh)
    sys.exit

setX(TARGET_DELAY, TARGET_REFRESH)
print("Ready for sending drive commands!\n")

# cmds:
# w --> forward
# s --> backward
# a --> rotate left
# d --> rotate right
# l --> less speed
# m --> more speed
# x --> last serial response
# q --> quit

keyList = ['q', 'x', 'p', 'w', 'a', 's', 'd', 'l', 'm']

while True:
    try:
        key = click.getchar()

        if currentMillis() - lastCmdSent > THROTTLE_TIME:
            # for debugging
            #print("waited {} milliseconds to move".format(currentMillis() - lastCmdSent))

            if key in keyList:
                if key == 'q':
                    mySocket.sendto(str.encode(key), (SERVER_IP, SERVER_PORT))
                    print("\nTerminating connection.\n")
                    #print("Resetting delay rate back to {} and refresh rate back to {}".format(originalDelay, originalRefresh))
                    setX(originalDelay, originalRefresh)
                    break
                elif key == 'x':
                    mySocket.sendto(str.encode(key), (SERVER_IP, SERVER_PORT))
                    print("\nDisplaying latest Teensy messages.\n")
                    lastCmdSent = currentMillis()
                elif key == 'p':
                    mySocket.sendto(str.encode(key), (SERVER_IP, SERVER_PORT))
                    print("\nPinging Teensy.\n")
                    lastCmdSent = currentMillis()
                    # wait till receive a response
                    #try:
                    #     checkResponse = currentMillis()
                    #     while checkResponse < 500:
                    #         (feedback, addr) = mySocket.recvfrom(SIZE)
                    #     if feedback:
                    #         print('feedback: ' + feedback.decode() + "\n")
                    #except:
                    #     continue
                else:
                    print("Sending key: " + key + "\n")
                    mySocket.sendto(str.encode(key), (SERVER_IP, SERVER_PORT))
                    print("key sent\n")
                    lastCmdSent = currentMillis()
            else:
                print("\nInvalid key, ignoring.\n")
                # need to send something to the server listener because this code expects feedback
                mySocket.sendto(str.encode(key), (SERVER_IP, SERVER_PORT))
                lastCmdSent = currentMillis()

            # wait till receive a response
            try:
                checkResponse = currentMillis()
                while checkResponse < RESPONSE_TIMEOUT:
                    (feedback, addr) = mySocket.recvfrom(SIZE)
                if feedback:
                    print('feedback: ' + feedback.decode() + "\n")

            except:
                continue

    except:
        setX(originalDelay, originalRefresh)
        break
