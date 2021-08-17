import { Component, OnInit } from '@angular/core';

interface NumBlock {
  numValue: number;
  leftStrValue: String;
  rightStrValue: String;
  middleStrValue: String;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-Quate';
  numbers:number[] = [];
  numBlocks:NumBlock [] = [];
  alert = '';
  showSettings = false;
  minNumberRange = -10;
  maxNumberRange = 10;
  numberOfNumbers = 8;
  winStatus = false;
  showSums: any;
  showGreaterThanSymbol: any;
  toggleCount = 0;
  toggleSumCount = 0;
  leftSum = 0;
  rightSum = 0;
  isInit = true;
  landingPageEnabled = true;
  currentLevel = 1;
  hideFilters = false;


  ngOnInit() {
    if(sessionStorage.getItem('gameItems') !== null){
      let items = JSON.parse(<any>sessionStorage.getItem('gameItems'));
      this.minNumberRange = items.minNumberRange;
      this.maxNumberRange = items.maxNumberRange;
      this.numberOfNumbers = items.numberOfNumbers;
      this.showGreaterThanSymbol = items.showGreaterThanSymbol;
      this.showSums = items.showSums;
      if(this.showGreaterThanSymbol === true) {
        console.log('.showGreaterThanSymbol === true');
        document.getElementById('greaterThanSwitch').click();
      }
      if(this.showSums === true) {
        console.log('this.showSums === true');
        document.getElementById('showSumSwitch').click();
      }
    } else {
      this.showSums = false;
      this.showGreaterThanSymbol = false;
    }
    this.isInit = false;
    this.startGame();
  }

  fullScreen() {
    if (!document['fullscreenElement']) {
      document.documentElement.requestFullscreen();
  } else {
    if (document['exitFullscreen']) {
      document.exitFullscreen(); 
    }
  }
  }

  exitSettings(){
    this.setLocalVariables();
    this.showSettings = false;
  }

  setLocalVariables(){
    let gameItems = {
      minNumberRange: this.minNumberRange,
      maxNumberRange: this.maxNumberRange,
      numberOfNumbers: this.numberOfNumbers,
      showGreaterThanSymbol: this.showGreaterThanSymbol,
      showSums: this.showSums
    };
    console.log('game itemmssss');
    console.log(gameItems);
    sessionStorage.setItem('gameItems', JSON.stringify(gameItems));
  }

  startGame(){
    this.setLocalVariables();
    this.leftSum = 0;
    this.rightSum = 0;
    this.winStatus = false;
    this.showSettings = false;
    this.numBlocks = [];
    this.numbers = this.generateNumbers(this.numberOfNumbers, this.minNumberRange, this.maxNumberRange);
    this.numbers.forEach(number => {
      let numBlock = {
        numValue: number,
        leftStrValue: '',
        rightStrValue: '',
        middleStrValue: number.toString()
      };
      this.numBlocks.push(numBlock);
    });
  }

  generateNumbers(amountOfNumbers: number, minRange: number, maxRange: number){
    let numbers: number[] = [];
    let firstSetSum = 0;
    let secondSetSum = 0;
    let index = 0;
    for(let i = 0; i < amountOfNumbers/2; i++) {
      let randNum = this.getRandomInt(minRange, maxRange);
      numbers[index] = randNum;
      firstSetSum += randNum;
      index ++;
    }
    for(let i = 0; i < amountOfNumbers/2 - 1; i++) {
      let randNum = this.getRandomInt(minRange, maxRange);
      numbers[index] = randNum;
      secondSetSum += randNum;
      index ++;
    }
    numbers[index] = (firstSetSum - secondSetSum);
    console.log('numbers');
    console.log(numbers);
    return numbers.sort();
  }

  numberClick(event: any, index:any) {
    console.log('numClick');
    let clickXPosition = event.offsetX;
    let widthOfClickedElem = document.getElementsByClassName('gridItem')[index - 1].clientWidth;
      if(widthOfClickedElem / 2 > clickXPosition) {
        this.addToLeftSide(index - 1);
      } else {
        this.addToRightSide(index - 1);
      }
  }

  addToLeftSide(numIndex: number){
    if(this.numBlocks[numIndex].rightStrValue === ''){
      this.numBlocks[numIndex].leftStrValue = this.numBlocks[numIndex].numValue.toString();
      this.numBlocks[numIndex].middleStrValue = '';
      this.checkForWin();
    }
  }

  addToRightSide(numIndex: number){
    if(this.numBlocks[numIndex].leftStrValue === ''){
      this.numBlocks[numIndex].rightStrValue = this.numBlocks[numIndex].numValue.toString();
      this.numBlocks[numIndex].middleStrValue = '';
      this.checkForWin();
    }
  }

  rightSideNumberDiscard(numIndex:any) {
    if(this.numBlocks[numIndex].rightStrValue !== ''){
      this.numBlocks[numIndex].middleStrValue = this.numBlocks[numIndex].rightStrValue;
      this.numBlocks[numIndex].rightStrValue = '';
      this.checkForWin();
    }
  }

  leftSideNumberDiscard(numIndex:any){
    if(this.numBlocks[numIndex].leftStrValue !== ''){
      this.numBlocks[numIndex].middleStrValue = this.numBlocks[numIndex].leftStrValue;
      this.numBlocks[numIndex].leftStrValue = '';
      this.checkForWin();
    }
  }

  checkForWin(){
    this.leftSum = 0;
    this.rightSum = 0;
    let totalLeftAndRightBlocks = 0;
    this.numBlocks.forEach(numBlock => {
      if(numBlock.leftStrValue !== '') {
        this.leftSum = this.leftSum + numBlock.numValue;
        totalLeftAndRightBlocks ++;
      } else if(numBlock.rightStrValue !== ''){
        this.rightSum = this.rightSum + numBlock.numValue;
        totalLeftAndRightBlocks++;
      }
    });
    if(this.leftSum === this.rightSum && totalLeftAndRightBlocks === this.numBlocks.length) {
      this.winStatus = true;
    } else {
      this.winStatus = false;
    }
    if (this.leftSum > this.rightSum){
      document.getElementById('greaterThanSymbol').innerHTML='>';
    } else if (this.rightSum > this.leftSum){
      document.getElementById('greaterThanSymbol').innerHTML='<';
    } else if (this.leftSum === this.rightSum) {
      document.getElementById('greaterThanSymbol').innerHTML='=';
    }
  }

  toggleGreaterThanSymbol(){
    if(this.isInit !== true){
      if(this.toggleCount === 1){
        this.showGreaterThanSymbol = !this.showGreaterThanSymbol;
        this.toggleCount = 0;
      } else {
        this.toggleCount++;
      }
    }
  }

  toggleSums(){
    if(this.isInit !== true){
      if(this.toggleSumCount === 1){
        this.showSums = !this.showSums;
        this.toggleSumCount = 0;
      } else {
        this.toggleSumCount++;
      }
    }
  }

  getRandomInt(min:any, max:any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}