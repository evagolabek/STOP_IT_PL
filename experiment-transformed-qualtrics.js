
Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and load required resources */
    var task_github = "https://evagolabek.github.io/STOP_IT_PL/"; // https://<your-github-username>.github.io/<your-experiment-name>

    // requiredResources must include all the JS files that demo-simple-rt-task-transformed.html uses.
    var requiredResources = [
        task_github + "js/jspsych-6.0.5/jspsych.js",
        task_github + "js/jspsych-6.0.5/plugins/jspsych-instructions.js",
        task_github + "js/jspsych-6.0.5/plugins/jspsych-fullscreen.js",
        task_github + "js/jspsych-6.0.5/plugins/jspsych-call-function.js",
        task_github + "js/jspsych-6.0.5/plugins/jspsych-html-keyboard-response.js",
        task_github + "js/jspsych-detect-held-down-keys.js",
        task_github + "js/custom-stop-signal-plugin.js",
        task_github + "js/sprintf.js",
        task_github + "configuration/experiment_variables.js",
        task_github + "configuration/text_variables.js",
        task_github + "stop-it_main.js"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 3: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');

    /* Change 4: Adding save and helper functions */
    function filter_data() {
        var ignore_columns = ['raw_rt', 'trial_type', 'first_stimulus', 'second_stimulus', 'onset_of_first_stimulus',
            'onset_of_second_stimulus', 'key_press', 'correct_response', 'trial_index', 'internal_node_id'
        ];
        var rows = {
            trial_type: 'custom-stop-signal-plugin'
        }; // we are only interested in our main stimulus, not fixation, feedback etc.
        var selected_data = jsPsych.data.get().filter(rows).ignore(ignore_columns);
        // the next piece of codes orders the columns of the data file
        var d = selected_data.values() // get the data values
        // make an array that specifies the order of the object properties
        var arr = ['block_i', 'trial_i', 'stim', 'signal', 'SSD', 'response', 'rt', 'correct',
            'focus', 'Fullscreen', 'time_elapsed', 'window_resolution'
        ];
        new_arr = [] // we will fill this array with the ordered data
        function myFunction(item) { // this is function is called in the arr.forEach call below
            new_obj[item] = obj[item]
            return new_obj
        }
        // do it for the whole data array
        for (i = 0; i < d.length; i++) {
            obj = d[i]; // get one row of data
            new_obj = {};
            arr.forEach(myFunction) // for each element in the array run my function
            selected_data.values()[i] = new_obj; // insert the ordered values back in the jsPsych.data object
        }
        return selected_data;
    }

    // you must put your save_data php url here.
    // like https://users.rcc.uchicago.edu/~kywch/exp_data/save_data.php
    var save_url = "<PUT YOUR SAVE URL HERE>";

	function avg(arr) {
		  var sum = 0;
		  // Iterate the elements of the array
		  arr.forEach(function (item, idx) {
			sum += item;
		  });
		  // Returning the average of the numbers
		  return sum / arr.length;
	}

    function save_data(data_dir, file_name) {
        var selected_data = filter_data();
        console.log("Save data function called.");
		console.log("selected_data", selected_data.values());

		let prop_ns_Missed_b1 = 0;
		let prop_ss_Correct_b1 = 0;

		let prop_ns_Missed_b2 = 0;
		let prop_ss_Correct_b2 = 0;

	    let prop_ns_Missed_b3 = 0;
		let prop_ss_Correct_b3 = 0;


        for (let value of selected_data.values()) {
          if(value.block_i === 1) {
			if (value.signal && value.correct) {
				prop_ss_Correct_b1++;
			}
			  else if (value.signal && !value.correct) {
				   prop_ns_Missed_b1++ ;
          }
          else if (value.block_i  === 2) {
			  if (value.signal && value.correct) {
				 prop_ss_Correct_b2++ ;
			}
			  else if (value.signal && !value.correct) {
			prop_ns_Missed_b2++;
          }
       }
		else if (value.block_i  === 3) {
			  if (value.signal && value.correct) {
				 prop_ss_Correct_b3++ ;
			}
			  else if (value.signal && !value.correct) {
			prop_ns_Missed_b3++;
          }

       }
	}

}
    let block_one_array = selected_data.values().map(x=> x.block_i === 1);
    console.log("block one rt array?", block_one_array);

		let block_one = selected_data.values().map(x=> x.block_i === 1).select("rt").mean();
    console.log("block one rt mean", block_one);



		//get proportion of correct and failed stops
		//let prop_ns_Missed_b1 = 0;
		//let prop_ss_Correct_b1 = 0;

		//let prop_ns_Missed_b2 = 0;
		//let prop_ss_Correct_b2 = 0;

	   // let prop_ns_Missed_b3 = 0;
		//let prop_ss_Correct_b3 = 0;

		//let prop_ns_Missed_total = 0;
		//let prop_ss_Correct_total = 0;

		// console.log("avg_nsRT_block_one", avg_nsRT_block_one);
		// console.log("avg_nsRT_block_two", avg_nsRT_block_two);
		// console.log("avg_nsRT_block_three", avg_nsRT_block_three);
    //
		// console.log("missed-stops-b1",  prop_ns_Missed_b1);
		// console.log("missed-stops-b2",  prop_ns_Missed_b2);
		// console.log("missed-stops-b3",  prop_ns_Missed_b3);
    //
		// console.log("correct-stops-b1",  prop_ss_Correct_b1);
		// console.log("correct-stops-b2",  prop_ss_Correct_b1);
		// console.log("correct-stops-b3",  prop_ss_Correct_b1);

        try {

      //save to qualtrics average nsRT per block and total avg
			// Qualtrics.SurveyEngine.setEmbeddedData("avg_nsRT_block_one", avg_nsRT_block_one);
			// Qualtrics.SurveyEngine.setEmbeddedData("avg_nsRT_block_two", avg_nsRT_block_two);
			// Qualtrics.SurveyEngine.setEmbeddedData("avg_nsRT_block_three", avg_nsRT_block_three);
			// Qualtrics.SurveyEngine.setEmbeddedData("avg_nsRT_total", avg_nsRT_total);

      //save to qualtrics total correct and failed stops per block and total avg
      Qualtrics.SurveyEngine.setEmbeddedData("correct_stops", correct_stop);
      Qualtrics.SurveyEngine.setEmbeddedData("failed_stops", failed_stop);


        } catch (err) {
            console.log("Save data function failed.", err);
        }
    }

    /* Change 5: Wrapping jsPsych.init() in a function */
    function initExp() {

        // experimental session-defining variables
        flag_debug = true;
        task_id = "STOP-IT";
        sbj_id = "${e://Field/workerId}";
        if (!sbj_id.trim()) {
            sbj_id = Math.random().toString(36).slice(-6);
            try {
                Qualtrics.SurveyEngine.setEmbeddedData("workerId", sbj_id);
            } catch (err) {
                console.log('Warning: ', err);
            }
        }

        // PHP-based data save function
        // save_data needs data_dir and file_name
        // my preference is to include the task id/name and sbj_id in the file name
        var data_dir = task_id;
        var file_name = task_id + '_' + sbj_id + '.csv';

        // push all the procedures, which are defined in stop-it_main.js to the overall timeline
        var timeline = []; // this array stores the events we want to run in the experiment
        timeline.push(start_procedure, block_procedure, end_procedure);

        jsPsych.init({
            display_element: 'display_stage',
            timeline: timeline,
            preload_images: [fix_stim, go_stim1, go_stim2, stop_stim1, stop_stim2],

            on_data_update: function (data) { // each time the data is updated:
                // write the current window resolution to the data
                data.window_resolution = window.innerWidth + ' x ' + window.innerHeight;

                // is the experiment window the active window? (focus = yes, blur = no)
                data.focus = focus;
                data.Fullscreen = fullscr_ON;
            },

            on_interaction_data_update: function (
                data) { //interaction data logs if participants leaves the browser window or exits full screen mode
                interaction = data.event;

                if (interaction.includes("fullscreen")) {
                    // some unhandy coding to circumvent a bug in jspsych that logs fullscreenexit when actually entering
                    if (fullscr_ON == 'no') {
                        fullscr_ON = 'yes';
                        return fullscr_ON
                    } else if (fullscr_ON == 'yes') {
                        fullscr_ON = 'no';
                        return fullscr_ON
                    }
                } else if (interaction == 'blur' || interaction == 'focus') {
                    focus = interaction;
                    return focus;
                }
            },

            exclusions: { // browser window needs to have these dimensions, if not, participants get the chance to maximize their window, if they don't support this resolution when maximized they can't particiate.
                min_width: minWidth,
                min_height: minHeight
            },

            on_finish: function () {
                save_data(data_dir, file_name);

                /* Change 6: Adding the clean up and continue functions.*/
                // clear the stage
                jQuery('#display_stage').remove();
                jQuery('#display_stage_background').remove();

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();
            }
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
