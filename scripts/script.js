'use strict';
const formatCurrency = (n) => {                 // формат записи сумм 
        const currency = new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 2,           // к-во знаков после запятой
    })
    return currency.format(n);
}

// --------------------------------------------------------------------------------------
// AUSN
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
        resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
        formAusn.expenses.value = '';
    }
    if(formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = 'block';
        resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.02);
    }
});

// -----------------------------------------------------------------------------------
// Самозанятый 
const selfEmployment = document.querySelector('.self-employment');
const formSelfEmployment = selfEmployment.querySelector('.calc__form');
const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
const resultTaxResult = selfEmployment.querySelector('.result__tax_result');


const checkCompensation = () => {
    const setDisplay = formSelfEmployment.addCompensation.checked ? 'block' : 'none';
    calcCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach((elem) => {
        elem.style.display = setDisplay;
    })
}
checkCompensation();

formSelfEmployment.addEventListener('input', () => {
    const resultIndividual = formSelfEmployment.individual.value * 0.04;
    const resultEntity = formSelfEmployment.entity.value * 0.06;

    checkCompensation();

    const tax = resultIndividual + resultEntity;

    formSelfEmployment.compensation.value =                 // налоговый вычет (не больше 10 000)
        formSelfEmployment.compensation.value > 10000 
        ? 10000 
        : formSelfEmployment.compensation.value;

    const benefit = formSelfEmployment.compensation.value;
    const resBenefit = formSelfEmployment.individual.value * 0.01 + formSelfEmployment.entity.value * 0.02;
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
    const finalTax = tax - (benefit - finalBenefit);

    resultTaxSelfEmployment.textContent = formatCurrency(tax);
    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
    resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
    resultTaxResult.textContent = formatCurrency(finalTax);
})


