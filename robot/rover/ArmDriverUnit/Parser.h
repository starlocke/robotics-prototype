#ifndef PARSER_H
#define PARSER_H

#include "PinSetup.h"
#include "RobotMotor.h"

struct commandInfo
{
  int whichMotor = 0; // which motor was requested to do something
  int whichDirection = 0; // set the direction
  int whichSpeed = 0; // set the speed
  unsigned int whichTime = 0; // how long to turn for
  bool angleCommand = false; // for regular operations, indicates that it's to control an angle
  float whichAngle = 0.0; // for regular operations, which angle to go to
  bool loopCommand = false; // for choosing between open loop or closed loop control
  int loopState = 0; // what type of loop state it is
  bool resetCommand = false; // indicates that something should be reset
  bool resetAngleValue = false; // mostly for debugging/testing, reset the angle variable
  bool resetJointPosition = false; // for moving a joint to its neutral position
  bool stopSingleMotor = false; // for stopping a single motor
  bool stopAllMotors = false; // for stopping all motors
};

class Parser
{
public:

  //Parser();
  void parseCommand(commandInfo& cmd, char *restOfMessage);
  bool verifCommand(commandInfo cmd);
};

/*
Parser::Parser(void)
{
}
*/

void Parser::parseCommand(commandInfo& cmd, char *restOfMessage)
{
  // check for emergency stop has precedence
  char * msgElem = strtok_r(restOfMessage, " ", & restOfMessage); // look for first element (first tag)
  if (String(msgElem) == "stop")
  {
    // msgElem is a char array so it's safer to convert to string first
    cmd.stopAllMotors = true;

#ifdef DEBUG_PARSING
    Serial.println("$S,Success: parsed emergency command to stop all motors");
#endif

  }
  // check for motor command
  else
    if (String(msgElem) == "motor")
    {
      // msgElem is a char array so it's safer to convert to string first
      msgElem = strtok_r(NULL, " ", & restOfMessage); // go to next msg element (motor number)
      cmd.whichMotor = atoi(msgElem);

#ifdef DEBUG_PARSING
      Serial.print("parsed motor ");
      Serial.println(cmd.whichMotor);
#endif

      // check for motor stop command has precedence
      msgElem = strtok_r(NULL, " ", & restOfMessage); // find the next message element (direction tag)
      if (String(msgElem) == "stop")
      {
        // msgElem is a char array so it's safer to convert to string first
        cmd.stopSingleMotor = true;

#ifdef DEBUG_PARSING
        Serial.println("$S,Success: parsed request to stop single motor");
#endif

      }
      // check for angle command
      else
        if (String(msgElem) == "angle")
        {
          // msgElem is a char array so it's safer to convert to string first
          cmd.angleCommand = true;
          msgElem = strtok_r(NULL, " ", & restOfMessage); // go to next msg element (desired angle value)
          cmd.whichAngle = atof(msgElem); // converts to float;

#ifdef DEBUG_PARSING
          Serial.print("$S,Success: parsed desired angle ");
          Serial.println(cmd.whichAngle);
#endif

        }
      // check for loop state command
      else
        if (String(msgElem) == "loop")
        {
          // msgElem is a char array so it's safer to convert to string first
          cmd.loopCommand = true;
          msgElem = strtok_r(NULL, " ", & restOfMessage); // go to next msg element (desired angle value)
          if (String(msgElem) == "open")
          {
            cmd.loopState = OPEN_LOOP;

#ifdef DEBUG_PARSING
            Serial.print("$S,Success: parsed open loop state (");
            Serial.print(cmd.loopState);
            Serial.println(") request");
#endif

          }
          else
            if (String(msgElem) == "closed")
            {
              cmd.loopState = CLOSED_LOOP;

#ifdef DEBUG_PARSING
              Serial.print("$S,Success: parsed closed loop state (");
              Serial.print(cmd.loopState);
              Serial.println(") request");
#endif

            }
          else
          {

#ifdef DEBUG_PARSING
            Serial.println("$E,Error: unknown loop state");
#endif

          }
        }
      // check for angle reset command
      else
        if (String(msgElem) == "reset")
        {
          // msgElem is a char array so it's safer to convert to string first
          cmd.resetCommand = true;
          msgElem = strtok_r(NULL, " ", & restOfMessage); // go to next msg element (desired angle value)
          if (String(msgElem) == "angle")
          {
            cmd.resetAngleValue = true;

#ifdef DEBUG_PARSING
            Serial.println("$S,Success: parsed request to reset angle value");
#endif

          }
          else
            if (String(msgElem) == "position")
            {
              cmd.resetJointPosition = true;

#ifdef DEBUG_PARSING
              Serial.println("$S,Sucess: parsed request to reset joint position");
#endif

            }
          else
          {

#ifdef DEBUG_PARSING
            Serial.println("$E,Error: unknown reset request");
#endif

          }
        }
      else
      {

#ifdef DEBUG_PARSING
        Serial.print("$E,Error: unknown motor ");
        Serial.print(cmd.whichMotor);
        Serial.println(" command");
#endif

      }
    }
  else
  {

#ifdef DEBUG_PARSING
    Serial.println("$E,Error: unknown motor command");
#endif

  }
}

bool Parser::verifCommand(commandInfo cmd)
{
  if (cmd.stopAllMotors)
  {

#ifdef DEBUG_VERIFYING
    Serial.println("$S,Success: command to stop all motors verified");
#endif

    return true;
  }
  // 0 means there was an invalid command and therefore motors shouldn't be controlled
  else
    if (cmd.whichMotor > 0 && cmd.whichMotor <= RobotMotor::numMotors)
    {
      if (cmd.stopSingleMotor)
      {

#ifdef DEBUG_VERIFYING
        Serial.print("$S,Success: command to stop motor ");
        Serial.print(cmd.whichMotor);
        Serial.println(" verified");
#endif

        return true;
      }
      else
        if (cmd.angleCommand)
        {
          if (cmd.whichAngle < -720 || cmd.whichAngle > 720)
          {

#ifdef DEBUG_VERIFYING
            Serial.print("$E,Error: angle of ");
            Serial.print(cmd.whichAngle);
            Serial.print(" degrees invalid for motor ");
            Serial.println(cmd.whichMotor);
#endif

            return false;
          }
          else
          {

#ifdef DEBUG_VERIFYING
            Serial.print("$S,Success: command to move motor ");
            Serial.print(cmd.whichMotor);
            Serial.print(" ");
            Serial.print(cmd.whichAngle);
            Serial.println(" degrees verified");
#endif

            return true;
          }
        }
      else
        if (cmd.loopCommand)
        {
          if (cmd.loopState == OPEN_LOOP || cmd.loopState == CLOSED_LOOP)
          {

#ifdef DEBUG_VERIFYING
            Serial.print("$S,Success: command to set motor ");
            Serial.print(cmd.whichMotor);
            if (cmd.loopState == OPEN_LOOP)
              Serial.println(" to open loop verified");
            if (cmd.loopState == CLOSED_LOOP)
              Serial.println(" to closed loop verified");
#endif

            return true;
          }
          else
          {

#ifdef DEBUG_VERIFYING
            Serial.println("$E,Error: invalid loop state");
#endif

            return false;
          }
        }
      else
        if (cmd.resetCommand)
        {
          if (cmd.resetAngleValue || cmd.resetJointPosition)
          {

#ifdef DEBUG_VERIFYING
            Serial.print("$S,Success: command to reset motor ");
            Serial.print(cmd.whichMotor);
            if (cmd.resetAngleValue)
              Serial.println(" saved angle value verified");
            if (cmd.resetJointPosition)
              Serial.println(" physical joint position verified");
#endif

            return true;
          }
          else
          {

#ifdef DEBUG_VERIFYING
            Serial.println("$E,Error: invalid reset request");
#endif

            return false;
          }
        }
      else

#ifdef DEBUG_VERIFYING
      Serial.print("$E,Error: command for motor ");
      Serial.print(cmd.whichMotor);
      Serial.println(" not recognized");
#endif

      return false;
    }
  else
    if
  (cmd.whichMotor < 0 || cmd.whichMotor >= RobotMotor::numMotors)
  {

#ifdef DEBUG_VERIFYING
    Serial.println("$E,Error: requested motor index out of bounds");
#endif

  }
  else
  {

#ifdef DEBUG_VERIFYING
    Serial.println("$E,Error: command not recognized");
#endif

    return false;
  }
}

#endif
