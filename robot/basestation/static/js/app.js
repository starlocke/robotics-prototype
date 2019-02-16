/* eslint-disable no-unused-vars */
let mockArmTable = true;

jQuery(document).ready((s) => {
  const Site = {
    init() {
      this.bindEventHandlers();
    },
    bindEventHandlers() {
      this.eventHandlers.forEach(eventHandler => this.bindEvent(eventHandler));
    },
    bindEvent(e) {
      let intervalId;
      const binder = () => {
        $.getJSON(e.route, e.handler);
        intervalId = setInterval(() => { $.getJSON(e.route, e.handler); }, 100);
        return false;
      };
      e.$el.bind(e.event, binder);
      e.$el.bind('mouseup', () => {
        clearInterval(intervalId);
      });
    },
    eventHandlers: [
      {
        $el: $('a#btn_pitch_up'),
        event: 'mousedown',
        route: '/mousedown_btn_pitch_up',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_pitch_down'),
        event: 'mousedown',
        route: '/mousedown_btn_pitch_down',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_roll_left'),
        event: 'mousedown',
        route: '/mousedown_btn_roll_left',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_roll_right'),
        event: 'mousedown',
        route: '/mousedown_btn_roll_right',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_claw_open'),
        event: 'mousedown',
        route: '/mousedown_btn_claw_open',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_claw_close'),
        event: 'mousedown',
        route: '/mousedown_btn_claw_close',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_arm_up'),
        event: 'mousedown',
        route: '/mousedown_btn_arm_up',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_arm_down'),
        event: 'mousedown',
        route: '/mousedown_btn_arm_down',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_arm_left'),
        event: 'mousedown',
        route: '/mousedown_btn_arm_left',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_arm_right'),
        event: 'mousedown',
        route: '/mousedown_btn_arm_right',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_arm_back'),
        event: 'mousedown',
        route: '/mousedown_btn_arm_back',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_arm_forward'),
        event: 'mousedown',
        route: '/mousedown_btn_arm_forward',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor1_ccw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor1_ccw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor1_cw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor1_cw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor2_ccw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor2_ccw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor2_cw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor2_cw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor3_ccw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor3_ccw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor3_cw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor3_cw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor4_ccw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor4_ccw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor4_cw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor4_cw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor5_ccw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor5_ccw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor5_cw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor5_cw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor6_ccw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor6_ccw',
        handler: (data) => { },
      },
      {
        $el: $('a#btn_motor6_cw'),
        event: 'mousedown',
        route: '/mousedown_btn_motor6_cw',
        handler: (data) => { },
      },
      {
        $el: $('button#ping-button'),
        event: 'mouseup',
        route: '/ping_rover',
        handler: (data) => {
            console.log(data);
            pingRover(data.ping_msg, data.ros_msg);
        },
    }
    ],
  };

    Site.init();

    $("#mux-0").mouseup(function() {
        $.ajax({
            url: '/select_mux',
            type: 'POST',
            data: "0",
            success: function(response){
                $("button#mux").text("Device 0: Rover");
                appendToConsole(response.output);
                scrollToBottom();
            }
        })
    })

    $("#mux-1").mouseup(function() {
        $.ajax({
            url: '/select_mux',
            type: 'POST',
            data: "1",
            success: function(response){
                $("button#mux").text("Device 1: Arm");
                appendToConsole(response.output);
                scrollToBottom();
            }
        })
    })

    $("#mux-2").mouseup(function() {
        $.ajax({
            url: '/select_mux',
            type: 'POST',
            data: "2",
            success: function(response){
                $("button#mux").text("Device 2: Science");
                appendToConsole(response.output);
                scrollToBottom();
            }
        })
    })

    $("#mux-3").mouseup(function() {
        $.ajax({
            url: '/select_mux',
            type: 'POST',
            data: "3",
            success: function(response){
                $("button#mux").text("Device 3: Lidar");
                appendToConsole(response.output);
                scrollToBottom();
            }
        })
    })

    $("#send-serial-btn").mouseup(function() {
        let cmd = $("#serial-cmd-input").val();

        $.ajax({
            url: '/serial_cmd',
            type: 'POST',
            data: {
                'cmd': cmd
            },
            success: function(response){
                clearSerialCmd();
                appendToConsole(response.output);
                scrollToBottom();
            }
        })
    })

    $("#serial-cmd-input").on('keyup', function (e) {
        if (e.keyCode == 13) {
            let cmd = $("#serial-cmd-input").val();

            $.ajax({
                url: '/serial_cmd',
                type: 'POST',
                data: {
                    'cmd': cmd
                },
                success: function(response){
                    clearSerialCmd();
                    appendToConsole(response.output);
                    scrollToBottom();
                }
            })
        }
    });

    //@TODO: fix implementation of odroid rx pub/sub to work on event triggers
    // rather than through polling
    // update odroid rx data every second
    //setInterval(updateOdroidRx, 1000);


    //@TODO: implement game loop for keyboard events:
    // https://stackoverflow.com/questions/12273451/how-to-fix-delay-in-javascript-keydown

    // KEYBOARD EVENTS
    // rover ping
    document.addEventListener("keydown", function (event) {
    if (event.ctrlKey  &&  event.altKey  &&  event.code === "KeyP") {
        $.ajax("/ping_rover", {
             success: function(data) {
                 console.log(data);
                 pingRover(data.ping_msg, data.ros_msg);
             },
             error: function() {
                console.log("An error occured")
             }
          });
    }
    });

    // manual controls
    let $serialCmdInput = $("#serial-cmd-input");
    let $m1BtnCw = $("#click_btn_motor1_cw > button");
    let $m1BtnCcw = $("#click_btn_motor1_ccw > button");
    let $m2BtnCw = $("#click_btn_motor2_cw > button");
    let $m2BtnCcw = $("#click_btn_motor2_ccw > button");
    let $m3BtnCw = $("#click_btn_motor3_cw > button");
    let $m3BtnCcw = $("#click_btn_motor3_ccw > button");
    let $m4BtnCw = $("#click_btn_motor4_cw > button");
    let $m4BtnCcw = $("#click_btn_motor4_ccw > button");
    let $m5BtnCw = $("#click_btn_motor5_cw > button");
    let $m5BtnCcw = $("#click_btn_motor5_ccw > button");
    let $m6BtnCw = $("#click_btn_motor6_cw > button");
    let $m6BtnCcw = $("#click_btn_motor6_ccw > button");
    // Unfortunately, this refactoring broke everything
    // let $m1Angle = $("#m1-angle");
    // let $m2Angle = $("#m2-angle");
    // let $m3Angle = $("#m3-angle");
    // let $m4Angle = $("#m4-angle");
    // let $m5Angle = $("#m5-angle");
    // let $m6Angle = $("#m6-angle");
    // let $m1Current = $("#m1-current");
    // let $m2Current = $("#m2-current");

    // motor 1
    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyW") {
            toggleToManual();
            $m1BtnCcw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m1-angle").text();

                if (currentAngle > -350) {
                    // simulate motor angles
                    $("#m1-angle").text(parseFloat(currentAngle) - 1);
                    // simulate motor currents
                    $("#m1-current").text("3.5");
                }
            }

        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyW") {
            $m1BtnCcw.css("background-color", "rgb(74, 0, 0)");

            if (mockArmTable) {
                $("#m1-current").text("0.2");
            }
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyS") {
            toggleToManual();
            $m1BtnCw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m1-angle").text();

                if (currentAngle < 350) {
                    $("#m1-angle").text(parseFloat(currentAngle) + 1);
                    // simulate motor currents
                    $("#m1-current").text("3.5");
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyS") {
            $m1BtnCw.css("background-color", "rgb(74, 0, 0)");
            $("#m1-current").text("0.2");
        }
    });

    // motor 2
    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyE") {
            toggleToManual();
            $m2BtnCcw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m2-angle").text();

                if (currentAngle > -75) {
                    $("#m2-angle").text(parseFloat(currentAngle) - 1);
                    // simulate motor currents
                    $("#m2-current").text("3.5");
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyE") {
            $m2BtnCcw.css("background-color", "rgb(74, 0, 0)");
            $("#m2-current").text("0.2");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyD") {
            toggleToManual();
            $m2BtnCw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m2-angle").text();

                if (currentAngle < 55) {
                    $("#m2-angle").text(parseFloat(currentAngle) + 1);
                    // simulate motor currents
                    $("#m2-current").text("3.5");
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyD") {
            $m2BtnCw.css("background-color", "rgb(74, 0, 0)");
            $("#m2-current").text("0");
        }
    });

    // motor 3
    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyR") {
            toggleToManual();
            $m3BtnCcw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m3-angle").text();

                if (currentAngle > -155) {
                    $("#m3-angle").text(parseFloat(currentAngle) - 1);
                }
            }
        }
    });
    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyR") {
            $m3BtnCcw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyF") {
            toggleToManual();
            $m3BtnCw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m3-angle").text();

                if (currentAngle < 35) {
                    $("#m3-angle").text(parseFloat(currentAngle) + 1);
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyF") {
            $m3BtnCw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    // motor 4
    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyT") {
            toggleToManual();
            $m4BtnCcw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m4-angle").text();

                if (currentAngle > -55) {
                    $("#m4-angle").text(parseFloat(currentAngle) - 1);
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyT") {
            $m4BtnCcw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyG") {
            toggleToManual();
            $m4BtnCw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                // no angle limits
                let currentAngle = $("#m4-angle").text();

                if (currentAngle < 40) {
                    $("#m4-angle").text(parseFloat(currentAngle) + 1);
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyG") {
            $m4BtnCw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    // motor 5
    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyY") {
            toggleToManual();
            $m5BtnCcw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                // no angle limits
                let currentAngle = $("#m5-angle").text();
                $("#m5-angle").text(parseFloat(currentAngle) - 1);
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyY") {
            $m5BtnCcw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyH") {
            toggleToManual();
            $m5BtnCw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                // no angle limits
                let currentAngle = $("#m5-angle").text();
                $("#m5-angle").text(parseFloat(currentAngle) + 1);
            }
        }
    });
    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyH") {
            $m5BtnCw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    // motor 6
    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyU") {
            toggleToManual();
            $m6BtnCcw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m6-angle").text();

                if (currentAngle > 0) {
                    $("#m6-angle").text(parseFloat(currentAngle) - 1);
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyU") {
            $m6BtnCcw.css("background-color", "rgb(74, 0, 0)");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyJ") {
            toggleToManual();
            $m6BtnCw.css("background-color", "rgb(255, 0, 0)");

            if (mockArmTable) {
                let currentAngle = $("#m6-angle").text();

                if (currentAngle < 75) {
                    $("#m6-angle").text(parseFloat(currentAngle) + 1);
                }
            }
        }
    });
    document.addEventListener("keyup", function (event) {
        if (!$serialCmdInput.is(":focus") && event.code === "KeyJ") {
            $m6BtnCw.css("background-color", "rgb(74, 0, 0)");
        }
    });
});
