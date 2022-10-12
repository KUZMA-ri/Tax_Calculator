'use strict';
const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');


for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', (e) => {
        e.preventDefault();

        console.log(navigationLinks[i].dataset.tax);        // data
        for (let j = 0; j < calcElems.length; j++) {
            if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
                calcElems[j].classList.add('calc_active');
                navigationLinks[j].classList.add('navigation__link_active')
            } else {
                calcElems[j].classList.remove('calc_active');
                navigationLinks[j].classList.remove('navigation__link_active')
            }        
        }
    })
};

const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
    if(formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formAusn.income.value * 0.08;
        formAusn.expenses.value = '';
    }
    if(formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = 'block';
        resultTaxTotal.textContent = (formAusn.income.value - formAusn.expenses.value) * 0.02;
    }
});

