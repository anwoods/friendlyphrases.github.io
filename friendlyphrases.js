$( document ).ready(function()
{
    var phrase = "I am bad whore";
    console.log('starting..');
    var afinn = afinn_en; //afinn english
    var cursewords = cursewords_list; // cursewords 
    var base_link = "http://words.bighugelabs.com/api/2/57fb326159dfcfd866e6778b33b451fb/"
    get_negative_words(phrase);
});

/*
    Returns a list of negative words
*/
function get_negative_words(phrase){
    var phrase_words = phrase.split(" ");
    for (var i = 0; i < phrase_words.length; i++){
        console.log(phrase_words[i]);
        console.log("afinn value: " + afinn[phrase_words[i]]);
    }
};