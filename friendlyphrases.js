var synonyms = {}; //dictionary key being the word, value being list of snynonms
var afinn = afinn_en; //afinn english
var cursewords = cursewords_list["Sheet1"]; // cursewords 
var base_link = "http://words.bighugelabs.com/api/2/7fe320022e2c6c0c2349d7401b242d9d/";
var jsonResult;
var data;
var bool_ = false;
var impword = "";
var count = 0;
var phrase = "I am a bad bitch getting dick";
var negative_words = [];
var words_afinn_dict = {};
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
    get_synonyms(phrase, true, false);
};

function get_synonyms(phrase, bool_, bool_include){
    var curse = false;
    new_phrase = phrase;
    var i = 0;
    var afinn_score = 0;
    temp_base_link = base_link;
    words_afinn_dict = {};
    if (bool_include){
        afinn_score = 0;
    }
    for (i = 0; i < negative_words.length; i++){
        if (bool_ == false){
            i = i + 1;
            if (i == negative_words.length){
                break;
            }
            bool_ = true;
        }
        base_link += (negative_words[i] + "/json");
        if (negative_words[i] in cursewords) { 
            var word = negative_words[i];
            var list = cursewords[word]["synonyms"].split(", ");
            var len = list.length - 1;
            synonyms[negative_words[i]] = cursewords[negative_words[i]]; // list of synonyms for negativewords[i]
            new_phrase = new_phrase.replace(negative_words[i], list[Math.floor(Math.random() * len)]);
            for (var j = 0; j < new_phrase.split(" ").length; j++){
                //afinn_score += afinn[new_phrase.split(" ")[j]];
                if (afinn[new_phrase.split(" ")[j]]){
                    afinn_score += (afinn[new_phrase.split(" ")[j]]);
                }
            }
            curse = true;
        } else {
            curse = false;
            $.ajax({
                type: 'GET',
                url: base_link,
                dataType: 'json',
                crossDomain: true,
                success: function(data){
                    var url_ = this.url;
                    var split_link = url_.split(temp_base_link);
                    var len = data["adjective"]["syn"].length - 1;
                    new_phrase = new_phrase.replace(split_link[1].split("/json")[0], data["adjective"]["syn"][Math.floor(Math.random() * len)]);
                    for (var j = 0; j < new_phrase.split(" ").length; j++){
                        if (afinn[new_phrase.split(" ")[j]]){
                            afinn_score += (afinn[new_phrase.split(" ")[j]]);
                        }
                    }
                    impword = new_phrase;
                    get_synonyms(impword, false, true);
                    //words_afinn_dict[new_phrase] = afinn_score;
                }
            });
        }
        base_link = "http://words.bighugelabs.com/api/2/7fe320022e2c6c0c2349d7401b242d9d/";
    }
    //calculate the afinn score here later 
    if (bool_include && count <= 3){
        words_afinn_dict[new_phrase] = {"afinn_score": afinn_score};
        count += 1;
        console.log(words_afinn_dict);
    }
    // if (count > 3){
    //     print_dict();
    // }
    new_phrase = phrase;
    bool_ = true;
}

function print_dict(){
    if (words_afinn_dict.length != 0){
        console.log(words_afinn_dict);
    }
}

