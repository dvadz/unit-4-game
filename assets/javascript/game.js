'use strict'
var debug = true;

function GameCharacter(name, attackPower,counterAttackPower) {
    this.name = name;
    this.HP = 150;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.hasDied = false;
    this.chosenOne = false;
}

var gameMortalKombat = {
    stage : 1
    ,characterThatWasRecentlyClicked : ""
    ,chosenCharacter : ""
    ,chosenOpponent : ""
    ,numberOfStrikes : 0
    ,challengeWinner : ""
    ,isChallangeOver : false
    ,gameOver : false
    ,hasSelectedACharacter     : false
    ,hasSelectedFirstOpponent  : false
    ,hasSelectedSecondOpponent : false
    ,hasSelectedThirdtOpponent : false
    ,characters : {
        "Johnny" : new GameCharacter("Johnny",15),
        "Liu"    : new GameCharacter("Liu",20),
        "Sonya"  : new GameCharacter("Sonya", 12),
        "Shang"  : new GameCharacter("Shang", 25),
    }
    ,getNameOfCharacters: function() {
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
        var yourAttackPower = this.numberOfStrikes * this.characters[this.chosenCharacter].attackPower;
        var opponentHP = this.characters[this.chosenOpponent].HP;
        var opponentAttackPower = this.characters[this.chosenOpponent].attackPower;
        if(debug) {console.log(yourHP, " ", yourAttackPower, " ", opponentHP, " ", opponentAttackPower);}

        //calculate your remaining HP
        yourHP = yourHP - opponentAttackPower;
        opponentHP = opponentHP - yourAttackPower;
        if(debug) {console.log("yourHP ", yourHP, "opponentHP: ", opponentHP);}

        //save HP 
        this.characters[this.chosenCharacter].HP = yourHP;
        this.characters[this.chosenOpponent].HP  = opponentHP;

        //check if any character has died, meaning HP <= 0
        if(yourHP<=0){
            this.characters[this.chosenCharacter].hasDied = true;
            this.isChallangeOver = true ;
            this.gameOver = true;
            if(debug){console.log("GAMEOVER!");}
        }
        if(opponentHP<=0){
            this.characters[this.chosenOpponent].hasDied = true;
            this.isChallangeOver = true ;
            buryTheDead();
            if(debug){console.log("WELL DONE, YOUR OPPONENT LOST! ARE YOU STILL ALIVE?");}
        }
        //if you are still alive and opponent has lost, set the "challengeWinner" and "isChallengeOver"
        if((this.characters[this.chosenOpponent].hasDied) && (!this.characters[this.chosenCharacter].hasDied)) {
            this.challengeWinner = this.chosenCharacter;
            this.setNextStage();
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
    sounds.toggleThemeSong();

    $(".speaker").on("click", function(){
        sounds.toggleThemeSong();
        if(debug){console.log("toggle song");}
    });

    $(".characters").on("click", function(){
        //identify which character was clicked and save it
        if(debug){console.log(this);}
        gameMortalKombat.setWhoWasClicked(this.id);
        console.log("CLICKED ON THE SCREEN", this.id);
        main();
    });

});

function main() {
    'use strict'
    //make a sound when a character is clicked

    // check if the game is over
    if(gameMortalKombat.gameOver) {
        gameOVER();
        return false;
    }

    var stage = gameMortalKombat.getWhatIsTheStage();
    //stage 1 - pick the character
    if(stage===1){
        selectYourCharacter();
        $("#instruction1").addClass("hidden");
    
    //stage 2 - pick you opponent
    } else if (stage===2) {
        selectYourOpponent();
    
    //stage 3 - fight you 1st opponent
    } else if(stage===3) {
        fight();
   
    //stage 4 - pick 2nd opponent 
    } else if(stage===4) {
        selectYourOpponent();

    //stage 5 - fight your 2nd oponent
    } else if(stage===5) {
        fight();
    
    //stage 6 - pick your 3rd oponent
    } else if(stage===6) {
        selectYourOpponent();

    //stage 7 - fight your 3rd oponent
    } else if(stage===7) {
        fight();
    }

}

    


function selectYourCharacter() {
    if(debug){console.log("function: selectYourCharacter");}

    //set the first character to be clicked as the CHOSENONE
    var character = gameMortalKombat.getWhoWasClicked();
    gameMortalKombat.setTheChosenCharacter(character);
    
    //hero class positions the character
    $("#" + character).addClass("hero");
    gameMortalKombat.setNextStage();

    var myCharacter = gameMortalKombat.getWhoIsTheChosenCharacter();
    // $("#" + myCharacter).css({"border":"5px solid blue","border-radius":"50px"}); 

    //have characters line up on the right
    $("#arena").removeClass("arena_0");
    $("#arena").addClass("arena_1");
}

function selectYourOpponent() {
    if(debug){console.log("function:select your opponent");}
    
    var theOpponent = gameMortalKombat.getWhoWasClicked();
    //check if the selected character is not the chosenOne

    //then that character as the chosen opponent
    gameMortalKombat.setTheOpponent(theOpponent);

    //move the selected opponent into position to fight and flip image horizontally
    var opp = "#" + theOpponent;
    $(opp).addClass("opponent");
    $(opp + " img").addClass("opponent-flip");
    
    // $("#" + theOpponent).css({"border":"5px solid red","border-radius":"30px"}); 
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
    $("#" + gameMortalKombat.chosenOpponent).hide();
}

function gameOVER(){
    if(debug){console.log("function: gameOVER")}
    //state on screen if the player lost
    
}

function drawTheCharacters() {

    //convert the character object into an array to run the forEach
    var arrayOfCharactersNames  = Object.keys(gameMortalKombat.getNameOfCharacters());
    if(debug){console.log(arrayOfCharactersNames);}
    arrayOfCharactersNames.forEach(function(character){
        if(debug){console.log(character);}
        
        //create a "card" for each character
        //the card will have an image, name and have a copy of the HP, Attack, Counter Attack, etc
        var card = $("<div>");
        card.addClass("characters " + character);
        card.attr({
            "id": character
        });

        //add an img and append it to the card
        var name = character;
        var image = $("<img>");
        var imageSrc = `./assets/images/${name}.jpg`
        if(debug){console.log(imageSrc);}
        image.attr({
            "src": imageSrc,
            "alt": name,
        });
        image.addClass("image");
        card.append(image);

        //this will show the name of the character
        var title = $("<h3 class='white'>").text(character);
        card.append(title);

        $("#arena").append(card);

    });
}