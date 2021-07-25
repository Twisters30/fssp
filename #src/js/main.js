document.addEventListener('DOMContentLoaded', () =>{

    let infoSlider = new Swiper('.info__container', {
        spaceBetween: 50,
        simulateTouch: false,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerColumn: 1,
        loop: false,
        // Optional parameters
        direction: 'horizontal',
        breakpoints: {
            675: {
                slidesPerView: 2,
                spaceBetween: 30,
                slidesPerGroup: 1,
            },
            1100: {
                slidesPerView: 3,
                spaceBetween: 50,
                slidesPerGroup: 1,
            }
            
            
        },
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // pagination
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
          },
        
      });

      new SimpleBar(document.querySelector('.dropdown__list'),{ 
          autoHide: false,
          scrollbarMaxSize: 40
        });

      function dropdown() {
            stateDropdown()          
                
      }

      function stateDropdown() {
        let dropList = document.querySelector('.dropdown__list');
        let dropPlace = document.querySelector('.dropdown__placeholder');
        let tabMobile = document.querySelector('[data-tab-content]')
        dropPlace.addEventListener('click', function() {
            if(dropList.classList.contains('is-open')) {
                tabMobile.style.minHeight = '93px'                            
                dropList.classList.remove('is-open')
            } else {
                tabMobile.style.minHeight = '450px'                  
                dropList.classList.add('is-open')
            }
            iconFlip()
            dropdownChoce();
        })
      }

      function iconFlip() {
          let dropList = document.querySelector('.dropdown__list');
          let iconArrow = document.querySelector('.dropdown__icon-arrow');
          if(dropList.classList.contains('is-open')) {
            iconArrow.classList.add('icon-flip')
          } else {
            iconArrow.classList.remove('icon-flip')
          }
      }

      function dropdownChoce() {
          let itemLi = document.querySelectorAll('.dropdown__item');
          let dropdownInput = document.querySelector('.dropdown__input');
          let ul = document.querySelector('.dropdown__list');
          itemLi.forEach(el => {
            el.addEventListener('click', function (event) {
                if(el == event.target) {
                    dropdownInput.value = el.textContent
                    ul.classList.remove('is-open')
                    iconFlip()
                }                
            })
        });
      }
      dropdown()

      function sortList() {
        document.querySelector('.dropdown__input').oninput = function() {
            let val = this.value.trim();
            let elasticItems = document.querySelectorAll('.dropdown__item');
            if(val != '') {
                elasticItems.forEach(function(el) {
                    if(el.innerText.search(val) == -1) {
                        el.classList.add('hide')
                        el.innerHTML = el.innerText
                    } else {
                        el.classList.remove('hide')
                        let str = el.innerText
                        el.innerHTML = insertMark(str, el.innerText.search(val), val.length);
                    }
                })
            } else {
              elasticItems.forEach(function(el) {
                  el.classList.remove('hide')
                  el.innerHTML = el.innerText;
              })
            }
        }
      }
      function insertMark(string,pos,len) {
          return string.slice(0,pos) + '<mark>' + string.slice(pos, pos + len) + '</mark>' + string.slice(pos + len);
      }

      function ucFirst(s) {
        if (!s) return s;
      
        return s[0].toUpperCase() + s.slice(1);
      }
      sortList();

    //   tab
    function refreshTab(){
        document.querySelectorAll('.tab__button').forEach(el => {
            el.classList.remove('btn-active')
        })
        document.querySelectorAll('.tab__content').forEach(el => {
            el.classList.remove('is-active')
        })
    }

    function tabState() {
        const tabBtns = document.querySelectorAll('.tab__button');
        const tabContent = document.querySelectorAll('.tab__content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                refreshTab(event.target);
                tabContent.forEach(content => {
                    if(btn.dataset.tab == content.dataset.tabContent) {                        
                        content.classList.add('is-active')
                        btn.classList.add('btn-active')
                    }
                })
            })
        })
    }
    
    function tabMobileClose() {
        document.querySelectorAll('.tab__content').forEach(el => {
            el.classList.remove('tab-mobile-open')
        })
    }
    tabState()

    function tabMobile() {
        let tabContent = document.querySelectorAll('.tab__signature');
        tabContent.forEach(el => {
            el.addEventListener('click', function() {
                if(this.parentElement.classList.contains('tab-mobile-open')) {
                    this.parentElement.classList.remove('tab-mobile-open')
                } else {
                    tabMobileClose();
                    this.parentElement.classList.add('tab-mobile-open')
                }
                
            })
        })   
    }
    tabMobile();

    function tabCardMobile(){
        let tabLi = document.querySelectorAll('.banner__item');
        let bannerIcon = document.querySelectorAll('.banner__icon-tab');
        bannerIcon.forEach(el => {
            el.addEventListener('click', function(e) {
                if(this.parentElement.classList.contains('tab-mobile-open')) {
                    this.parentElement.classList.remove('tab-mobile-open')
                } else {
                    tabLi.forEach(el => el.classList.remove('tab-mobile-open'))
                    this.parentElement.classList.add('tab-mobile-open')
                }
            })
        })
    }
    tabCardMobile()

})
