(async () => {
let list = []

await fetch('https://dummyjson.com/products')
  .then(res => res.json())
  .then(data => list = data.products);

const dataList = document.querySelector('.dataList')

const inputAmount = dataList.querySelector('.dataList__options-amount-input')
const inputSorting = dataList.querySelector('.dataList__options-sorting-input')
const dropdownArrow = dataList.querySelector('.dataList__options-sorting-arrow')
const optionsSorting = dataList.querySelector('.dataList__options-sorting')
const dropdown = dataList.querySelector('.dataList__options-sorting-dropdown')

const btnEnter = dataList.querySelector('.dataList__options-btn-enter')
const btnClear = dataList.querySelector('.dataList__options-btn-clear')

const paragraphs = dataList.querySelector('.dataList__paragraphs')
let paragraphList = dataList.querySelectorAll('.dataList__paragraph')

const description = dataList.querySelector('.dataList__description')
const descriptionText = description.querySelector('.dataList__description-text')
const descriptionImage = description.querySelector('.dataList__description-image')
const descriptionPrice = description.querySelector('.dataList__description-price')
const descriptionRating = description.querySelector('.dataList__description-rating')

// Buttons & inputs//
btnEnter.onclick = function() {
  if (inputSorting.value != '') sortingList(inputSorting.value, 2)
  else sortingList('id', 1)
  if (inputAmount.value != '') {
    createParagraph(+inputAmount.value)
  }else{
    createParagraph(defaultParagraphAmount)
  }
  addMouseEvents(dataList.querySelectorAll('.dataList__paragraph'))
}

document.onkeydown = function(e) {
  if (e.keyCode === 13) {
    if (inputAmount.value != '') {
      sortingList(inputSorting.value)
      createParagraph(+inputAmount.value)
      addMouseEvents(dataList.querySelectorAll('.dataList__paragraph'))
    }
  }
}

btnClear.onclick = function() {
  inputAmount.value = ''
  inputSorting.value = ''
}

//dropdown
inputSorting.onclick = function(e) {
  dropdown.classList.toggle('dataList__options-sorting-dropdown_hiden')
  dropdownArrow.classList.toggle('dataList__options-sorting-arrow_active')
  
}

let dropdownSortingList = ['Price', 'Rating']
dropdownSortingList.forEach(dropdownParagraph => {
  dropdown.innerHTML += `<div class="dataList__options-sorting-dropdown-paragraph">${dropdownParagraph}</div>`
})

let dropdownParagraphList = dropdown.querySelectorAll('.dataList__options-sorting-dropdown-paragraph')
dropdownParagraphList.forEach((dropdownParagraph, i) => {
  dropdownParagraph.onclick = function(e) {
    inputSorting.value = dropdownSortingList[i]
  }
})

document.onclick = (e) => {
  if(!e.composedPath().includes(optionsSorting)){
    dropdown.classList.add('dataList__options-sorting-dropdown_hiden')
    dropdownArrow.classList.remove('dataList__options-sorting-arrow_active')
    description.classList.add('dataList__description_hiden')
  }
}

// crete paragraphs //
let defaultParagraphAmount = 10
createParagraph(defaultParagraphAmount)
addMouseEvents(dataList.querySelectorAll('.dataList__paragraph'))
inputAmount.placeholder = `1 - ${list.length}`

// Functions //
/*
* Добавляет на параграфы события перетаскивания и показывает описание при наведении
*
* @param {HTMLCollection} paragraphList Коллекция параграфоф 
*/
function addMouseEvents(paragraphList) {
  paragraphList.forEach((listItem, i) => {
    listItem.onmousedown = function(e) {
      newBreakpoints(paragraphList)
      let shiftY = e.pageY - listItem.getBoundingClientRect().top
      // create fake paragraph
      let fakeParagraph = listItem.cloneNode(true)
      fakeParagraph.classList.add('dataList__paragraph_fake')
      fakeParagraph.style.width = listItem.offsetWidth + 'px'
      fakeParagraph.style.top = e.pageY - shiftY + window.pageYOffset + 'px'
      paragraphs.append(fakeParagraph)
      // hide target paragraph
      listItem.classList.add('dataList__paragraph_hiden')
      // set position for fake paragraph
      let indexLastFocusedItem = i
      document.onmousemove = function(e) {
        if (e.pageY - shiftY > paragraphList[0].getBoundingClientRect().top &&
            e.pageY - shiftY < paragraphList[paragraphList.length - 1].getBoundingClientRect().top) {
          fakeParagraph.style.top = e.pageY - shiftY + window.pageYOffset + 'px'
        }

        // moving
        if(0 < getParagraphIndex(fakeParagraph)) {
          if (getParagraphIndex(fakeParagraph)-1 == indexLastFocusedItem) {
            paragraphList[getParagraphIndex(fakeParagraph)-1].innerHTML = paragraphList[getParagraphIndex(fakeParagraph)].innerHTML
            paragraphList[getParagraphIndex(fakeParagraph)-1].classList.remove('dataList__paragraph_hiden')
            paragraphList[getParagraphIndex(fakeParagraph)].innerHTML = fakeParagraph.innerHTML
            paragraphList[getParagraphIndex(fakeParagraph)].classList.add('dataList__paragraph_hiden')
            indexLastFocusedItem = getParagraphIndex(fakeParagraph)
            // animation
            slideDown(paragraphList[getParagraphIndex(fakeParagraph)-1])
          }
        }
        if(paragraphList.length > getParagraphIndex(fakeParagraph)) {
          if (getParagraphIndex(fakeParagraph)+1 == indexLastFocusedItem) {
            paragraphList[getParagraphIndex(fakeParagraph)+1].innerHTML = paragraphList[getParagraphIndex(fakeParagraph)].innerHTML
            paragraphList[getParagraphIndex(fakeParagraph)+1].classList.remove('dataList__paragraph_hiden')
            paragraphList[getParagraphIndex(fakeParagraph)].innerHTML = fakeParagraph.innerHTML
            paragraphList[getParagraphIndex(fakeParagraph)].classList.add('dataList__paragraph_hiden')
            indexLastFocusedItem = getParagraphIndex(fakeParagraph)
            // animation
            slideUp(paragraphList[getParagraphIndex(fakeParagraph)+1])
          }
        }   
      }
      document.onmouseup = function(e) {
          document.onmousemove = null
          fakeParagraph.classList.add('dataList__paragraph_hiden')
          listItem.classList.remove('dataList__paragraph_hiden')
          paragraphList[getParagraphIndex(fakeParagraph)].classList.remove('dataList__paragraph_hiden')
          newBreakpoints(paragraphList)
        }
    }

    // show description
    listItem.onmouseover = (e) => {
        description.style.width = listItem.offsetWidth + 'px'
        description.style.top = `${listItem.getBoundingClientRect().top + window.pageYOffset}px`
        description.classList.remove('dataList__description_hiden')
        descriptionImage.src = list[e.target.querySelector('.dataList__paragraph-number').innerHTML-1].images[0]
        descriptionText.innerHTML = list[e.target.querySelector('.dataList__paragraph-number').innerHTML-1].description
        descriptionPrice.innerHTML = 'Price: ' + list[e.target.querySelector('.dataList__paragraph-number').innerHTML-1].price + '$'
        descriptionRating.innerHTML = 'Rating: ' + list[e.target.querySelector('.dataList__paragraph-number').innerHTML-1].rating
    }
    listItem.onmouseleave = (e) => {
      description.classList.add('dataList__description_hiden')
    }
  })
}

/*
* Определяет точки оси Y, при пересечении которых параграфы меняются местами. Изменяет глобальную переменную breakPoints
*
* @param {HTMLCollection} paragraphList Коллекция параграфоф 
*/
function newBreakpoints(paragraphList){
  breakPoints = []
  paragraphList.forEach((paragraph, i) => {
    breakPoints.push(paragraph.getBoundingClientRect().top + paragraphList[i].offsetHeight / 2 + window.pageYOffset + extIntFromSrt(getComputedStyle(paragraphList[1]).marginTop) / 2)
  })
}

/*
* Определят какое место в списке занимает передаваемый параграф
*
* @param {HTMLelement} paragraph Параграф
*/
function getParagraphIndex(paragraph) {
  let counter = 0
  breakPoints.forEach((breakPoint, i) => {
    if (paragraph.getBoundingClientRect().top + window.pageYOffset > breakPoint) {
      counter++
    }
  })
  return counter
}

/*
* Создает и добавляет HTML елементы-параграыф в DOM согласно порядку из глобальной переменной list. 
*
* @param {number} amount Количество параграфов
*/
function createParagraph(amount) {
  if(amount < 1 || amount > 30){
    alert('incorrect value')
    return 0
  }
  paragraphs.innerHTML = ''
  for(let i = 0; i < amount; i++){
    paragraphs.innerHTML += 
    `<div class="dataList__paragraph">
      <div class="dataList__paragraph-number">${i+1}</div>
      <div class="dataList__paragraph-text">${list[i].title}</div>
    </div>`
  }
}

/*
* Сортирует массив list в зависимости от переданного параметра и принципа
*
* @param {string} parametr Устанавливает по какому параметру будет сортировка
* @param {number} mode Указывет по какому принципу сортируются элементы
*
* mode == 1 сортирует список по убыванию
* mode == 2 сортирует список по возрастанию
*/
function sortingList(parametr, mode = 2) {
  parametr = parametr.toLowerCase()
  let sortParams
  if(mode == 1){
    sortParams = (a, b) => a[parametr] > b[parametr] ? 1 : -1
  }else if(mode == 2){
    sortParams = (a, b) => a[parametr] < b[parametr] ? 1 : -1
  }
  list.sort(sortParams)
}

/*
* Вытаскивает цифры из строки, даже если в ней присутствуют буквы.
* Например строка "70px" вернет "70"
*
* @param {string} x Строка для отбора цифр
* @return {number} возвращет цифры.
*/
function extIntFromSrt(x) {
  return parseInt(x.match(/\d+/)[0])
}

/*
* Анимация для параграфа. Появление снизу
*
* @param {HTMLelement} paragraph Параграф
*/
function slideUp(elem) {
  let shiftY = -100
  elem.style.transform = `translateY(${shiftY}%)`
  let timer = setInterval(() => {
    if(shiftY <= 0){
      elem.style.transform = `translateY(${shiftY}%)`
      shiftY += 5
    }else clearInterval(timer)
  },5)
}

/*
* Анимация для параграфа. Появление сверху
*
* @param {HTMLelement} paragraph Параграф
*/
function slideDown(elem) {
  let shiftY = 100
  elem.style.transform = `translateY(${shiftY}%)`
  let timer = setInterval(() => {
    if(shiftY >= 0){
      elem.style.transform = `translateY(${shiftY}%)`
      shiftY -= 5
    }else clearInterval(timer)
  },5)
}

/*
* Анимация для экрана загрузки. Исчезновение
*
* @param {HTMLelement} elem Элемент для исчезновения
*/
function fadeOut(elem) {
  let opacity = 100
  let timer = setInterval(() => {
    if(opacity >= -100){
      elem.style.opacity = opacity + '%'
      opacity -= 5
    }else{
      elem.style.display = 'none'
      clearInterval(timer)
    } 
  },7)
}

// Предзгрузка изображений
let preloadImages = []
list.forEach((item, i) => {
  preloadImages.push(new Image())
  preloadImages[i].src = list[i]['images'][0]
})

// Скрытие экрана загрузки
fadeOut(document.querySelector('#loading'))
})()