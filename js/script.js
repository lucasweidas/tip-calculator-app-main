(() => {
    function setInputFilter(textbox, inputFilter) {
        // This filter function is created by emkey08 "https://jsfiddle.net/emkey08/zgvtjc51"
        [
            'input',
            'keydown',
            'keyup',
            'mousedown',
            'mouseup',
            'select',
            'contextmenu',
            'drop',
        ].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty('oldValue')) {
                    this.value = this.oldValue;
                    this.setSelectionRange(
                        this.oldSelectionStart,
                        this.oldSelectionEnd
                    );
                } else {
                    this.value = '';
                }
            });
        });
    }

    function getValues() {
        billValue = inputBill.value.replace(',', '.');
        peopleValue = inputPeoples.value;
        const button = checkBtnTip();
        if (button !== false) {
            tipValue = button.textContent.replace('%', '');
            isTipEmpty();
            return;
        }
        tipValue = inputTip.value.replace(',', '.');
        isTipEmpty();
    }

    function checkActive() {
        getValues();
        if (
            billValue.length === 0 &&
            checkBtnTip() === false &&
            tipValue.length === 0 &&
            peopleValue.length === 0
        ) {
            btnReset.classList.remove('active');
            return false;
        }
        btnReset.classList.add('active');
        return true;
    }

    function checkSelected(button) {
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            return;
        }
        if (inputTip.value.length > 0) {
            inputTip.value = '';
        }
        for (const button of btnTip) {
            button.classList.remove('selected');
        }
        button.classList.add('selected');
    }

    function checkBtnTip() {
        for (const button of btnTip) {
            if (button.classList.contains('selected')) return button;
        }
        return false;
    }

    function checkPeople() {
        getValues();
        const button = checkBtnTip();
        if (
            ((button !== false || tipValue.length > 0) &&
                billValue.length > 0 &&
                (peopleValue.length === 0 || peopleValue === '0')) ||
            peopleValue === '0'
        ) {
            sectionPeople.classList.add('invalid');
            inputPeoples.classList.add('invalid');
            return;
        }
        sectionPeople.classList.remove('invalid');
        inputPeoples.classList.remove('invalid');
    }

    function isTipEmpty() {
        if (Number(tipValue) > 0 || tipValue.length === 0) {
            document.querySelector('.tip-section').classList.remove('really');
            return;
        }
        document.querySelector('.tip-section').classList.add('really');
    }

    function isEmpty() {
        getValues();
        if (
            billValue.length !== 0 &&
            tipValue.length !== 0 &&
            peopleValue.length !== 0 &&
            peopleValue !== '0'
        ) {
            tipCalculator();
            return;
        }
        clearResult();
    }

    function tipCalculator() {
        const billNum = Number(billValue);
        const tipNum = Number(tipValue);
        const peopleNum = Number(peopleValue);
        const perPerson = (billNum * tipNum) / 100 / peopleNum;
        const totPerson = (perPerson * peopleNum + billNum) / peopleNum;
        tipPerson.innerText = `$${perPerson.toFixed(2)}`;
        totalPerson.innerText = `$${totPerson.toFixed(2)}`;
    }

    function clearResult() {
        tipPerson.innerText = '$0.00';
        totalPerson.innerText = '$0.00';
    }

    function reset() {
        const button = checkBtnTip();
        inputBill.value = '';
        if (button !== false) checkSelected(button);
        else inputTip.value = '';
        inputPeoples.value = '';
        clearResult();
        checkPeople();
        checkActive();
    }

    const inputBill = document.querySelector('#bill');
    const btnTip = document.querySelectorAll('.btn-tip');
    const inputTip = document.querySelector('#tip');
    const sectionPeople = document.querySelector('.num-peoples-c');
    const inputPeoples = document.querySelector('#peoples');
    const tipPerson = document.querySelector('.tip-person');
    const totalPerson = document.querySelector('.total-person');
    const btnReset = document.querySelector('.btn-reset');

    setInputFilter(inputBill, value => /^-?\d*[.,]?\d{0,2}$/.test(value));

    setInputFilter(inputTip, value => /^\d*[.,]?\d{0,2}$/.test(value));

    setInputFilter(inputPeoples, value => /^\d*$/.test(value));

    let billValue, tipValue, peopleValue;

    inputBill.addEventListener('input', () => {
        getValues();
        checkActive();
        checkPeople();
        isEmpty();
    });

    btnTip.forEach(button => {
        button.addEventListener('click', () => {
            getValues();
            checkSelected(button);
            checkActive();
            checkPeople();
            isEmpty();
        });
    });

    inputTip.addEventListener('input', () => {
        getValues();
        const button = checkBtnTip();
        if (button !== false) checkSelected(button);
        checkActive();
        checkPeople();
        isEmpty();
    });

    inputPeoples.addEventListener('input', () => {
        getValues();
        checkActive();
        checkPeople();
        isEmpty();
    });

    btnReset.addEventListener('click', () => {
        if (checkActive()) reset();
    });
})();
