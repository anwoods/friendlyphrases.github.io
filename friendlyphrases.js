var synonyms = {}; //dictionary key being the word, value being list of snynonms
var afinn = afinn_en; //afinn english
var cursewords = cursewords_list["Sheet1"]; // cursewords 
var base_link = "http://words.bighugelabs.com/api/2/787bdcc6a514ef29e35a75fd57d9e387/";
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

function main(){
    console.log("here");
    $( document ).ready(function()
    {
        phrase = document.getElementById('phrase').value;   
        get_negative_words(phrase);
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
    while (count <= 10){
        get_synonyms(phrase, true, false);
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
    for (i = 0; i < negative_words.length; i++){
        var listing = listings.appendChild(document.createElement('div'));
        listing.id = "listing-" + i;
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
        base_link = "http://words.bighugelabs.com/api/2/787bdcc6a514ef29e35a75fd57d9e387/";
    }
    if (bool_include){
        afinn_score = 0;
        for (var j = 0; j < new_phrase.split(" ").length; j++){
            if (afinn[new_phrase.split(" ")[j]]){
                afinn_score += (afinn[new_phrase.split(" ")[j]]);
            }
        }
        words_afinn_dict[afinn_score] = new_phrase;
        listing.innerHTML = new_phrase;
    }
    new_phrase = phrase;
}

function print_dict(){ 
    //words_afinn_dict[og_afinn_num] = phrase;
    //console.log(words_afinn_dict);
    
    // var listings = document.getElementById('listings');
    // var listing = listings.appendChild(document.createElement('div'));
    // listing.className = 'item';
    // listing.id = "listing-" + 0;
    // listing.innerHTML = "HI";

    // var link = listing.appendChild(document.createElement('a'));
    // link.href = '#';
    // link.className = 'title';
    // link.dataPosition = 0;
}

