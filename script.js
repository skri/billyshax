jQuery(document).ready(function() {

	//Load a random sonnet from a local file based on Sam Dutton's
	//JSON version of Shakespeare's sonnets
	//samdutton.wordpress.com/2011/03/09/shakespeares-sonnets-in-json-format/
	$("#load").click(function() {
		$(this).html("Loading");
		$(this).prop("disabled", true);
		n = Math.floor((Math.random() * 154) + 1);
		$.ajax({
			url: "sonnets.json",
			dataType: "json",
			complete: function(jqXHR, textStatus) {
				$("#load").html("Load a Sonnet");
				$("#load").prop("disabled", false);
			},
			error: function(jqXHR, textStatus, errorThrown){
				$("#sonnet_area").text("Error: " + jqXHR.status + " - " + errorThrown);
			},
			//add span tags around each word before printing
			//there's gotta be a less ugly way to select/modify words?
			//(like, without all the spans?)
			//but i mean, i don't know it, time is limited, etc etc
			success: function(data) {
				for (i in data) {
					if (data[i].number == n) {
						$("#sonnet_area").html("<h1>Sonnet " + n + "</h1>");
						for (j in data[i].lines) {
							words = data[i].lines[j].split(" ");
							line = "";
							for (word in words) {
								line = line + "<span class=\'" + words[word].replace(/[^\w\s]/g,"") + "\'>" + words[word] + "</span> ";
							}
							$("#sonnet_area").append(line + "<br />");
						}
					}
				}
			}
		});
	});

	//clicking on a word pulls its rhymes and chooses one at random to replace it with
	//(or the word turns red if there are no rhymes)
	//this uses Allison Parrish's javascript interface to the CMU pronouncing dictionary
	//github.com/aparrish/pronouncingjs
	$(document).on('click', 'span', function(){
		var rhymes = pronouncing.rhymes($(this).html().replace(/[^\w\s]/g,"").toLowerCase());
	    len = rhymes.length;
	    if (len > 0) {
	   		i = Math.floor(Math.random() * len);
	   		rhyme = rhymes[i];
	   		$(this).html(rhyme);
	   		$(this).removeClass().addClass(rhyme);
		}
		else {
			$(this).css("color", "red");
		}
	});
});