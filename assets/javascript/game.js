'use strict'
var debug = true;

function GameCharacter(name, damage) {
    this.name = name;
    this.HP = 150;
    this.damage = damage;
    this.hasDied = false;
    this.chosenOne = false;
}

var gameMortalKombat = {
    stage : 1
    ,characterThatWasRecentlyClicked : ""
    ,chosenCharacter : ""
    ,chosenOpponent : ""
    ,numberOfStrikes : 0
    ,strikeMultiplier : 9
    ,challengeWinner : ""
    ,isChallangeOver : false
    ,gameOver : false
    ,characters : {
        "Johnny_Cage" : new GameCharacter("Johnny_Cage",20),
        "Liu"         : new GameCharacter("Liu",50),
        "Sonya"       : new GameCharacter("Sonya", 15),
        "Shang_Tsung" : new GameCharacter("Shang_Tsung", 75),
    }
    ,getWhoAreTheCharacters: function() {
        return this.characters;
    }
    ,getWhoWasClicked : function(){
        if(debug){console.log("getWhoWasClicked: ", this.characterThatWasRecentlyClicked);}
        return this.characterThatWasRecentlyClicked;
    }    
    ,setWhoWasClicked : function(characterName){
        this.characterThatWasRecentlyClicked = characterName;
        if(debug){console.log("setWhoWasClicked: ", this.characterThatWasRecentlyClicked);}
    }
    ,setTheChosenCharacter: function(character) {
        this.chosenCharacter = character;
        //set the character's object to have "chosenOne" = true
        this.characters[character].chosenOne = true;
        //this.characters(this.characters.indexOf(character)).chosenOne = true;
        if(debug){console.log("setTheChosenCharacter: ", this.chosenCharacter);
                  console.log("this.character[character]: ", this.characters[character]);}
    }
    ,getWhoIsTheChosenCharacter: function() {
        if(debug){console.log("getWhoIsTheChosenCharacter:", this.chosenCharacter);}
        return this.chosenCharacter;
    }
    ,setTheOpponent : function(character){
        this.chosenOpponent = character;
        if(debug){console.log("setTheOpponent:", this.chosenOpponent);}
    }
    ,getTheOpponent : function(){
        return this.chosenOpponent;
        if(debug){console.log("getTheOpponent:", this.chosenOpponent);}
    }
    ,setNextStage: function(){
        this.stage++;
        if(debug){console.log("setNextStage: ", this.stage);}
    }
    ,getWhatIsTheStage : function () {
        return this.stage;
    }
    ,strike: function() {
        if(debug) {console.log("gameMortalKombat: strike");}
        
        this.numberOfStrikes++;
        var yourHP = this.characters[this.chosenCharacter].HP;
        var yourDamages = this.numberOfStrikes * this.strikeMultiplier;
        var opponentHP = this.characters[this.chosenOpponent].HP;
        var opponentDamages = this.characters[this.chosenOpponent].damage;
        if(debug) {console.log(yourHP, " ", yourDamages, " ", opponentHP, " ", opponentDamages);}

        //calculate your remaining HP
        yourHP = yourHP - opponentDamages;
        opponentHP = opponentHP - yourDamages;
        if(debug) {console.log("yourHP ", yourHP, "opponentHP: ", opponentHP);}

        //save HP 
        this.characters[this.chosenCharacter].HP = yourHP;
        this.characters[this.chosenOpponent].HP  = opponentHP;

        //check if any character has died, meaning HP <=0
        if(yourHP<=0){
            this.characters[this.chosenCharacter].hasDied = true;
            this.isChallangeOver = true ;
            this.gameOver = true;
            if(debug){console.log("GAMEOVER!");}
        }
        if(opponentHP<=0){
            this.characters[this.chosenOpponent].hasDied = true;
            this.isChallangeOver = true ;
            if(debug){console.log("WELL DONE, YOUR OPPONENT LOST! ARE YOU STILL ALIVE?");}
        }
        //if you are still alive and opponent has lost, set the "challengeWinner" and "isChallengeOver"
        if((this.characters[this.chosenOpponent].hasDied) && (!this.characters[this.chosenCharacter].hasDied)) {
            this.challengeWinner = this.chosenCharacter;
        }
    }
};

var sounds = {
     themeSong : new Audio("../assets/sounds/Mortal_Kombat_theme.mp3")
     ,isthemeSongPlaying : false
     ,toggleThemeSong: function() {
        if(this.isthemeSongPlaying) {
            this.themeSong.pause();
            this.themeSong.currentTime = 0;
            if(debug){console.log("stopping song");}
            this.isthemeSongPlaying = false;
        } else {
            this.themeSong.play();
            this.themeSong.loop = true;
            if(debug){console.log("playing song");}
            this.isthemeSongPlaying = true;
        }
    }
};


$(document).ready(function(){
    //setup the game
    drawTheCharacters();
    //sounds.toggleThemeSong();

    $(".speaker").on("click", function(){
        sounds.toggleThemeSong();
        if(debug){console.log("toggle song");}
    });

    $(".characters").on("click", function(){
        //identify which character was clicked and save it
        gameMortalKombat.setWhoWasClicked(this.id);
        console.log("CLICKED ON THE SCREEN", this.id);
        main();
    });

});

function main() {
    'use strict'
    //make a sound when a character is clicked

    var stage = gameMortalKombat.getWhatIsTheStage();
    //stage = 1 - pick the character
    if(stage===1){
        selectYourCharacter();
    
        //stage = 2 - pick you opponent
    } else if (stage===2) {
        selectYourOpponent();
    
        //stage = 3 - fight you 1st opponent
    }  else if(stage==3) {
        fight();
    }
}

function selectYourCharacter() {
    if(debug){console.log("function: selectYourCharacter");}

    gameMortalKombat.setTheChosenCharacter(gameMortalKombat.getWhoWasClicked());
    gameMortalKombat.setNextStage();

    var myCharacter = gameMortalKombat.getWhoIsTheChosenCharacter();
    //move your character into position to fight - for now just change the border 
    $("#" + myCharacter).css({"border":"5px solid blue","border-radius":"30px"}); 
    //the rest move into a corner
    

    $("#arena").removeClass("arena_0");
    $("#arena").addClass("arena_1");
    
 
}

function selectYourOpponent() {
    if(debug){console.log("function:select your opponent");}
    
    var theOpponent = gameMortalKombat.getWhoWasClicked();
    //check if the selected character is not the chosenOne

    //then that character as the chosen opponent
    gameMortalKombat.setTheOpponent(theOpponent);

    //move the selected opponent into position to fight - for now just change the border 
    $("#" + theOpponent).css({"border":"5px solid red","border-radius":"30px"}); 
    gameMortalKombat.setNextStage();
}

function fight(){
    if(debug){console.log("function:fight ");}
    
    //check that the you striked the CURRENT opponent
    if(gameMortalKombat.getWhoWasClicked()===gameMortalKombat.getTheOpponent()){
        if(debug){console.log("You just striked ", gameMortalKombat.getTheOpponent());}
        gameMortalKombat.strike();
    }
    //check if either character has died
     if(gameMortalKombat.chosenCharacter){

     }
}

function buryTheDead(name) {

}


function drawTheCharacters() {
    
    //convert the character object into an array to do forEach
    var arrayOfCharactersNames  = Object.keys(gameMortalKombat.getWhoAreTheCharacters());

    arrayOfCharactersNames.forEach(function(character){
        if(debug){console.log(character);}
        
        var name = character;
        var character = $("<img>");
        character.addClass("characters");
        character.attr({
            "id": name,
            "alt": name
        });
        character.css({'width':'100px',"height":"100px","margin":"20px", "border":"1px solid red","color":"white"});
        $("#arena").append(character);
    });
}