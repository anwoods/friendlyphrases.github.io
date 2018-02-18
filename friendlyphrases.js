var synonyms = {}; //dictionary key being the word, value being list of snynonms
var afinn = afinn_en; //afinn english
var cursewords = cursewords_list["Sheet1"]; // cursewords 
var base_link = "http://words.bighugelabs.com/api/2/8c1e8a9f924103d69bf9008e8096fd14/";
var jsonResult;
var data;
var bool_ = false;
var impword = "";
var count = 0;
var negative_words = [];
var words_afinn_dict = {};
negative_words = [];
var final_ans = [];
var og_afinn_num = 0;
var phrase = "";
var ajax_syn = [];

function main(){
    console.log("here");
    $( document ).ready(function()
    {
        console.log("clicked");
        phrase = document.getElementById('phrase').value;   
        if (document.getElementById("listing-2")){
            document.getElementById("listing-2").innerHTML = "";
        }
        if (phrase){
            get_negative_words(phrase);
        }
    });
}


/*
    Returns a list of negative words
*/
function get_negative_words(phrase){
    console.log(phrase); 
    var phrase_words = phrase.split(" ");
    og_afinn_num = 0;
    for (var i = 0; i < phrase_words.length; i++){
        if (afinn[phrase_words[i]]){
            og_afinn_num += afinn[phrase_words[i]];
        }
        if (afinn[phrase_words[i]] < 0){
            negative_words.push(phrase_words[i]);
        }
    }
    document.getElementById('ogword').innerHTML = phrase + ": " + og_afinn_num + "% positive";
    while (count <= 3){
        get_synonyms(phrase, true, false);
        console.log(phrase);
        count += 1;
    }
    print_dict();
};

function get_synonyms(phrase, bool_, bool_include){
    var curse = false;
    new_phrase = phrase;
    var i = 0;
    var afinn_score = 0;
    temp_base_link = base_link;
    //words_afinn_dict = {};
    if (bool_include){
        //afinn_score = 0;
    }
    var listings = document.getElementById('listings');
    console.log(negative_words.length);
    for (i = 0; i < negative_words.length; i++){
        var listing = listings.appendChild(document.createElement('div'));
        if (bool_ == false){
            i = i + 1;
            bool_ = true;
        }
        base_link += (negative_words[i] + "/json");
        if (negative_words[i] in cursewords) { 
            var word = negative_words[i];
            var list = cursewords[word]["synonyms"].split(", ");
            var len = list.length - 1;
            synonyms[negative_words[i]] = cursewords[negative_words[i]]; // list of synonyms for negativewords[i]
            new_phrase = new_phrase.replace(negative_words[i], list[Math.floor(Math.random() * len)]);
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
                    impword = new_phrase;
                    get_synonyms(impword, false, true);
                }
            });
        }
        base_link = "http://words.bighugelabs.com/api/2/8c1e8a9f924103d69bf9008e8096fd14/";
    }
    if (bool_include){
        afinn_score = 0;
        for (var j = 0; j < new_phrase.split(" ").length; j++){
            if (afinn[new_phrase.split(" ")[j]]){
                afinn_score += (afinn[new_phrase.split(" ")[j]]);
            }
        }
    }
    listing.id = "listing-" + i;
    words_afinn_dict[afinn_score] = new_phrase;
    listing.innerHTML = new_phrase + ": " + (afinn_score + 5 * 10) + "% positive";
    new_phrase = phrase;
    document.getElementById('phrase').value = "";
    console.log(phrase);
}
