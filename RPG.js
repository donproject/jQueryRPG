$(function() {
  var mapWidth = 5, mapHeight = 5, cellWdith, cellHeight, rowString, cellContents = {}, noTreasure = true, tempRow, tempCol;
  var user = {}, answer1, answer2, answer3, answer4;
  var monster = {};
  var clickedRow, clickedCol;

  user.showInfo = function() {
    $('#characterName').text(user.name);
    $('#chr').text(user.charisma + "/19");
    $('#int').text(user.intelligence + "/19");
    $('#dex').text(user.dexterity + "/19");
    $('#str').text(user.strength + "/19");
    $('#life').text(user.life + "/100");
  };

  user.display = function() {
    var cell = '#' + user.row.toString() + "-" + user.col.toString();
    tempCol = user.col - 1;
    tempRow = "row" + user.row.toString();

    if (cellContents[tempRow][tempCol] == "Treasure") {
      $('#mapContainer').hide();
      $('#winningContainer').show();
      $('#winningContainer img').before('<img src="images/'+user.character+'.png">');
      $('footer').text("You won!");
    }
    if (cellContents[tempRow][tempCol] == "Monster") {
      $('#mapContainer').hide();
      $('#monsterContainer').show();
      $('footer').text("Good luck!");
      cellContents.fight();
    }
    $(cell).html("You.");
    $(cell).addClass("viewed");
  };

  user.move = function() {
    var oldCell = '#' + user.row.toString() + "-" + user.col.toString();
    var newCell = '#' + clickedRow.toString() + "-" + clickedCol.toString();

    $(oldCell).html("");
    user.row = clickedRow;
    user.col = clickedCol;
    user.display();
  };

  cellContents.fight = function () {
    monster.charisma = Math.floor(Math.random() * 19) + 1;
    monster.intelligence = Math.floor(Math.random() * 19) + 1;
    monster.strength = Math.floor(Math.random() * 19) + 1;
    monster.dexterity = Math.floor(Math.random() * 19) + 1;
    monster.life = Math.floor(Math.random() * 19) + 1;

    $('#monsterRun').unbind('click').on('click',function () {
      if (user.charisma > monster.charisma && user.intelligence > monster.intelligence) {
        $('#message').text("You escape with ease!");
      } else if (user.charisma <= monster.charisma && user.intelligence <= monster.intelligence) {
        user.life -= 10;
        $('#message').text("The monster gravely wounds you as you flee!");
      } else {
        user.life -= Math.floor(monster.strength / 4)+1;
        $('#message').text("The monster hits you, but you manage to escape!");
      }
      decideNextAction();
    });
    $('#monsterFight').unbind('click').on('click',function () {
      while (monster.life > 0 && user.life > 0) {
        if (user.strength > monster.strength && user.dexterity > monster.dexterity) {
          monster.life = 0;
        } else if (user.strength <= monster.strength && user.dexterity <= monster.dexterity) {
          monster.life -= Math.floor(user.strength / 4) + 1;
          user.life -= Math.floor(monster.strength / 4) + 1;
        } else {
          monster.life -= Math.floor(user.strength / 2) + 1;
          user.life -= Math.floor(monster.strength / 2) + 1;
        }
      }
      decideNextAction();
    });

    $('#fightDone').on('click',function () {
      $('#mapContainer').show();
      $('#messageContainer').hide();
      $('footer').text("Hint: Click a section of the dungeon next to your character.");
    });
  };

  var decideNextAction = function() {
    if (monster.life <= 0) {
      $('#message').text("You killed the monster!");
      cellContents[tempRow][tempCol] = "Empty";
    }
    if (user.life <= 0) {
      $('#message').text("You died!");
      $('footer').text("Awwwwwwwwwww.");
      user.life = 0;
      $('#fightDone').remove();
    }
    user.showInfo();
    $('#monsterContainer').hide();
    $('#messageContainer').show();
  };

  // create map
  for (var row=1;row<=mapHeight;row++) {
    rowString = '<div class="mapRow">';
    var tempRowContent = [], rowName = "row";

    for (var col=1;col<=mapWidth;col++) {
      rowString += '<span class="mapBlock" id="'+row+'-'+col+'"></span>';
      var choice = Math.random();

      if (choice < 0.1 && noTreasure) {
        tempRowContent.push("Treasure");
        noTreasure = false;
      } else if (choice < 0.6) {
        tempRowContent.push("Monster");
      } else {
        tempRowContent.push("Empty");
      }
    }

    rowName += row.toString();
    cellContents[rowName] = tempRowContent;
    rowString += '</div>';
    $('#mapContainer').append(rowString);
  }
  cellHeight = 90/mapHeight;
  cellHeight = cellHeight.toString() + "%";
  $('.mapRow').height(cellHeight);
  cellWidth = 100/mapWidth;
  cellWidth = cellWidth.toString() + "%";
  $('.mapBlock').width(cellWidth);

  if (noTreasure) {
    tempRow = Math.floor(Math.random() * 4) + 1;
    tempRow = "row" + tempRow.toString();
    tempCol = Math.floor(Math.random() * 4);
    cellContents[tempRow][tempCol] = "Treasure";
  }

  // create character
  $('#characterDone').on('click',function(){
    user.name = $('input[name="player"]').val();
    if (user.name === '') {
      user.name = "Ol' No Name";
    }
    user.character = $('select[name="class"]').val();
    switch (user.character) {
      case 'pirate':
        user.charisma = 15;
        user.dexterity = 14;
        user.intelligence = 9;
        user.strength = 10;
        break;
      case 'ninja':
        user.charisma = 8;
        user.dexterity = 17;
        user.intelligence = 13;
        user.strength = 11;
        break;
      case 'robot':
        user.charisma = 4;
        user.dexterity = 7;
        user.intelligence = 16;
        user.strength = 15;
        break;
      case 'dinosaur':
        user.charisma = 6;
        user.dexterity = 4;
        user.intelligence = 4;
        user.strength = 18;
        break;
      default:
        user.charisma = 10;
        user.dexterity = 10;
        user.intelligence = 10;
        user.strength = 10;
        break;
    }
    answer1 = $('select[name="question1"]').val();
    switch (answer1) {
      case 'a':
      user.charisma -= 2;
      break;
      case 'b':
      user.charisma += 2;
      break;
      case 'c':
      user.strength += 1;
      break;
      default:
      user.dexterity += 1;
      break;
    }
    answer2 = $('select[name="question2"]').val();
    switch (answer2) {
      case 'a':
      user.charisma -= 1;
      user.intelligence -= 2;
      break;
      case 'b':
      user.charisma += 1;
      user.strength -= 1;
      break;
      case 'c':
      user.intelligence += 2;
      break;
      default:
      user.dexterity += 1;
      user.intelligence -= 1;
      break;
    }
    answer3 = $('select[name="question3"]').val();
    switch (answer3) {
      case 'a':
      user.dexterity -= 1;
      break;
      case 'b':
      user.charisma += 1;
      user.intelligence += 1;
      break;
      case 'c':
      user.intelligence += 1;
      user.strength -= 1;
      break;
      default:
      user.dexterity += 2;
      break;
    }
    answer4 = $('select[name="question4"]').val();
    switch (answer4) {
      case 'a':
      user.strength += 2;
      break;
      case 'b':
      user.charisma += 1;
      user.strength -= 1;
      user.intelligence -= 1;
      break;
      case 'c':
      user.charisma += 2;
      user.strength -= 2;
      break;
      default:
      user.dexterity += 1;
      user.intelligence -= 2;
      break;
    }

    user.life = 100;
    user.fights = 0;
    user.explored = 0;
    user.row = Math.floor(Math.random() * mapWidth) + 1;
    user.col = Math.floor(Math.random() * mapHeight) + 1;
    $('#characterSheet').slideUp(1000,function() {
      user.showInfo();
      tempRow = "row" + user.row;
      tempCol = user.col - 1;
      cellContents[tempRow][tempCol] = "Empty";
      user.display();
      $('#characterInfo').show();
      $('#mapContainer').show();
      $('footer').text("Hint: Click a section of the dungeon next to your character.");
    });
  });

  // play game 
  $('.mapBlock').on('click',function (event) {
    var clickedBlock = event.target.id, leftCol = parseInt(user.col,10) - 1, rightCol = parseInt(user.col,10) + 1, upRow = parseInt(user.row,10) - 1, downRow = parseInt(user.row,10) + 1;
    clickedCol = clickedBlock[2];
    clickedRow = clickedBlock[0];

    if (((clickedCol == leftCol || clickedCol == rightCol) && clickedRow == user.row) || ((clickedRow == upRow || clickedRow == downRow) && clickedCol == user.col)) {
      user.move();
    } else if (clickedCol == user.col && clickedRow == user.row) {
      $('footer').text("Hint: You are already there. Try a different section.");
    } else {
      $('footer').text("Hint: You can only move one block at a time! Try a different section.");
    }
  });
});