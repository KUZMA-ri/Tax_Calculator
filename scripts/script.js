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
// Navigation
{
    const navigationLinks = document.querySelectorAll('.navigation__link');
    const calcElems = document.querySelectorAll('.calc');


    for (let i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].addEventListener('click', (e) => {
            e.preventDefault();

            // console.log(navigationLinks[i].dataset.tax);        // data
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
}

// AUSN
{
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
}

// -----------------------------------------------------------------------------------
// Самозанятый 

{
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
}
// -------------------------------------------------------------------------------
// OCHO

{
    const osno = document.querySelector('.osno');
    const formOsno = osno.querySelector('.calc__form');
    const ndflExpenses= osno.querySelector('.result__block_ndfl-expenses');
    const ndflIncome= osno.querySelector('.result__block_ndfl-income');
    const profit = osno.querySelector('.result__block_profit');

    const resultTaxNds = osno.querySelector('.result__tax_nds');
    const resultTaxProperty = osno.querySelector('.result__tax_property');
    const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
    const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
    const resultTaxProfit = osno.querySelector('.result__tax_profit');


    const checkFormBusiness = () => {                   // функция для проверки формы бизнеса (ИП или ООО)
        if (formOsno.formBusiness.value === 'IP') {
            ndflExpenses.style.display = '';    
            ndflIncome.style.display = '';
            profit.style.display = 'none';
        }

        if (formOsno.formBusiness.value === 'OOO') {
            ndflExpenses.style.display = 'none';    
            ndflIncome.style.display = 'none';
            profit.style.display = '';
        }
    }
    checkFormBusiness();


    formOsno.addEventListener('input', () => {
        checkFormBusiness();

        const income = formOsno.income.value;
        const expenses = formOsno.expenses.value;
        const property = formOsno.property.value;

        const nds = income * 0.2;
        const taxProperty = property * 0.02;
        const profit = income - expenses;
        const ndflExpensesTotal = profit * 0.13;
        const ndflIncomeTotal = (income - nds) * 0.13;
        const taxProfit = profit * 0.2;

        resultTaxNds.textContent = formatCurrency(nds);
        resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
        resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
        resultTaxProfit.textContent = formatCurrency(taxProfit);
    });
}
// ----------------------------------------------------------------------------
// УСН
{
    const LIMIT = 300_000;
    const usn = document.querySelector('.usn');
    const formUsn = usn.querySelector('.calc__form');

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses'); 
    const calcLabelProperty = usn.querySelector('.calc__label_property');
    const resultBlockProperty = usn.querySelector('.result__block_property');

    const resultTaxTotal = usn.querySelector('.result__tax_total');
    const resultTaxProperty = usn.querySelector('.result__tax_property');

    const typeTax = {
        'income': () => {
            calcLabelExpenses.style.display = 'none';
            calcLabelProperty.style.display = 'none';
            resultBlockProperty.style.display = 'none';

            formUsn.expenses.value = '';
            formUsn.property.value = '';
        },
        'IpExpenses': () => {
            calcLabelExpenses.style.display = '';
            calcLabelProperty.style.display = 'none';
            resultBlockProperty.style.display = 'none';

            formUsn.property.value = '';
        },
        'OooExpenses': () => {
            calcLabelExpenses.style.display = '';
            calcLabelProperty.style.display = '';
            resultBlockProperty.style.display = '';
        },
    }

    typeTax[formUsn.typeTax.value]();
    
    const percent = {
        'income': 0.06,
        'IpExpenses': 0.15,
        'OooExpenses': 0.15
    }

    formUsn.addEventListener('input', () => {
        typeTax[formUsn.typeTax.value](); 
        const income = formUsn.income.value;
        const expenses = formUsn.expenses.value;
        const contributions = formUsn.contributions.value;
        const property = formUsn.property.value;

        let profit = income - contributions;

        if (formUsn.typeTax.value !== 'income') {
            profit -= expenses;
        };

        const taxBigIncome = income > LIMIT ? ((profit - LIMIT) * 0.01) : 0;
        const sum = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
        const tax = sum * percent[formUsn.typeTax.value];
        const taxProperty = property * 0.02;

        resultTaxTotal.textContent = formatCurrency(tax);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
    })
};
// ------------------------------------------------------------------------------





