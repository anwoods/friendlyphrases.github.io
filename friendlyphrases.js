var synonyms = {}; //dictionary key being the word, value being list of snynonms
var afinn = afinn_en; //afinn english
var cursewords = cursewords_list["Sheet1"]; // cursewords 
var base_link = "http://words.bighugelabs.com/api/2/57fb326159dfcfd866e6778b33b451fb/";
var jsonResult;
var data;
var phrase = "I am bad bitch getting dick";
var negative_words = [];
negative_words = [];

$( document ).ready(function()
{
    get_negative_words(phrase);
});

/*
    Returns a list of negative words
*/
function get_negative_words(phrase){
    var phrase_words = phrase.split(" ");

    for (var i = 0; i < phrase_words.length; i++){
        if (afinn[phrase_words[i]] < 0){
            negative_words.push(phrase_words[i]);
        }
    }
    get_synonyms(negative_words);
};


/*
    function for returning synonyms associated with a word
*/
// function get_synonyms(negative_words){
//     //checking if the word is a curse word, because if it's a curse word, the thesuarus api will not recognize and return a FAIL
//     for (var i = 0; i < negative_words.length; i++){
//         if (negative_words[i] in cursewords){
//             synonyms[negative_words[i]] = cursewords[negative_words[i]]; // list of synonyms for negativewords[i]
//         } else {
//             base_link += (negative_words[i] + "/json");
//             //retrieve the synonyms using jquery from thesaurus api 
//             new_phrase = phrase;
//             var list = [];
//             $.ajax({
//                 type: 'GET',
//                 url: base_link,
//                 dataType: 'json',
//                 crossDomain: true,
//                 success: function(data) {
//                     jsonResult = data;
//                     list = negative_words;
//                     dict_temp = {};
//                     dict_temp["word"] = list[0];
//                     dict_temp["synonyms"] = jsonResult["adjective"]["syn"];
//                     //console.log(synonyms);
//                     console.log(negative_words[i]);
//                     new_phrase = new_phrase.replace(negative_words[i], dict_temp["synonyms"][1]);
//                     console.log(new_phrase);
//                 }
//             });
//             //resetting the link
//             base_link = "http://words.bighugelabs.com/api/2/57fb326159dfcfd866e6778b33b451fb/";
//         }
//     }
//     replace_bad_words(phrase, synonyms);
// };

function get_synonyms(){
    new_phrase = phrase;
    var i = 0;
    temp_base_link = base_link;
    for (i = 0; i < negative_words.length; i++){
        base_link += (negative_words[i] + "/json");
        console.log("base link: " + base_link);
        if (negative_words[i] in cursewords){ 
            var word = negative_words[i];
            var list = cursewords[word]["synonyms"].split(", ");
            synonyms[negative_words[i]] = cursewords[negative_words[i]]; // list of synonyms for negativewords[i]
            new_phrase = new_phrase.replace(negative_words[i], list[1]);
        } else {
            $.ajax({
                type: 'GET',
                url: base_link,
                dataType: 'json',
                crossDomain: true,
                
                success: function(data){
                  var url_ = this.url;
                  var split_link = url_.split(temp_base_link);
                  new_phrase = new_phrase.replace(split_link[1].split("/json")[0], data["adjective"]["syn"][1]);
                  console.log(new_phrase);   
                }
              });
        }
        base_link = "http://words.bighugelabs.com/api/2/57fb326159dfcfd866e6778b33b451fb/";
    }
}


/* 
    function to replace all of the bad words with more positive words 
*/
function replace_bad_words(phrase, synonyms){
    // new_phrase = phrase;
    // for (var i = 0; i < negative_words.length; i++){
    //     var word = negative_words[i];
    //     console.log(synonyms[word]);
    //     try {
    //         console.log(synonyms[word]['synonyms']);
    //     }
    //     catch (err) {
    //         console.log(synonyms[word]['synonyms'][1]);
    //     }
    //     new_phrase = new_phrase.replace(negative_words[i], synonyms[negative_words[i][0]]);
    // }
    // console.log(new_phrase);
}