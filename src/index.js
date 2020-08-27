import './app.scss';

let lastsearch = 'Ahaus';
const lastTake = 20;
let skip = 0;
let timeoutID = 0;
let name;
let mail;
let url;
let comment;
let isNameFull = false;
let isMailFull = false;

chayns.ready.then(() => {
    chayns.ui.initAll();
    document.getElementById('ready').disabled = true;
    document.getElementById('ready').classList.add('disabled');
    loadpages();
    setEventlister('#loadMore', '#textInp');
}).catch(() => {
}).then(() => {
});

const setEventlister = (buttonid, suchId) => {
    document.querySelector(buttonid).addEventListener('click', loadMore);
    document.querySelector(suchId).addEventListener('keypress', seachTimeout);
    document.querySelector('#name').addEventListener('keypress', () => {
        formularCheck(1);
    });
    document.querySelector('#mail').addEventListener('keypress', () => {
        formularCheck(2);
    });
    document.querySelector('#url').addEventListener('keypress', () => {
        formularCheck(3);
    });
    document.querySelector('#comment').addEventListener('keypress', () => {
        formularCheck(4);
    });
    document.querySelector('#name').addEventListener('blur', () => {
        formularCheck(1);
    });
    document.querySelector('#mail').addEventListener('blur', () => {
        formularCheck(2);
    });
    document.querySelector('#ready').addEventListener('click', formular);
};

//formular
const formularCheck = (check) => {
    if (check === 1) {
        name = document.querySelector('#name').value;
        if (name.length > 0) {
            document.querySelector('.name').classList.add('labelRight');
            document.querySelector('#nameLabel').classList.remove('input--invalid');
            isNameFull = true;
        } else {
            document.querySelector('.name').classList.remove('labelRight');
            document.querySelector('#nameLabel').classList.add('input--invalid');
            isNameFull = false;
        }
    } else if (check === 2) {
        name = document.querySelector('#mail').value;
        if (name.length > 0) {
            document.querySelector('.mail').classList.add('labelRight');
            document.querySelector('#mailLabel').classList.remove('input--invalid');
            isMailFull = true;
        } else {
            document.querySelector('.mail').classList.remove('labelRight');
            document.querySelector('#mailLabel').classList.add('input--invalid');
            isMailFull = false;
        }
    } else if (check === 3) {
        name = document.querySelector('#url').value;
        if (name.length > 0) {
            document.querySelector('.adresse').classList.add('labelRight');
        } else {
            document.querySelector('.adresse').classList.remove('labelRight');
        }
    } else if (check === 4) {
        name = document.querySelector('#comment').value;
        if (name.length > 0) {
            document.querySelector('.comment').classList.add('labelRight');
        } else {
            document.querySelector('.comment').classList.remove('labelRight');
        }
    }
    if (isMailFull && isNameFull) {
        document.getElementById('ready').disabled = false;
        document.getElementById('ready').classList.remove('disabled');
    } else {
        document.getElementById('ready').disabled = true;
        document.getElementById('ready').classList.add('disabled');
    }
};
//login
const login = () => {
    chayns.addAccessTokenChangeListener(() => {
    });
    chayns.login();
};

//formular
const formular = () => {
    if (!chayns.env.user.isAuthenticated) {
        login();
    }

    name = document.querySelector('#name').value;
    mail = document.querySelector('#mail').value;
    url = document.querySelector('#url').value;
    comment = document.querySelector('#comment').value;

    if (name.length >= 1 && mail.length >= 1) {
        chayns.intercom.sendMessageToPage({
            text: `Name: ${name}
            Mail: ${mail}
            Url: ${url}
            Kommentar: ${comment}`
        }).then((data) => {
            if (data.status === 200) {
                chayns.dialog.alert('', 'thank you');
            }
        });
    } else {
        chayns.dialog.alert('Hinweis', 'Name und Email sind pflicht!');
    }
};
//seachTimerout
const seachTimeout = () => {
    if (timeoutID > 0) {
        clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
        search();
        timeoutID = 0;
    }, 500);
};
//search
const search = () => {
    skip = 0;
    const output = document.querySelector('#textInp').value;
    lastsearch = output;
    loadpages(true);
};

const loadMore = () => {
    skip += lastTake;
    loadpages();
};
//showpages
const showpages = (datas) => {
    for (let i = 0; i < datas.length; i += 1) {
        let pagename = datas[i].appstoreName;
        const pageicon = datas[i].locationId;
        const { siteId } = datas[i];

        if (pagename.length >= 13) {
            pagename = pagename.substring(0, 10);
            pagename += '...';
        }
        const pageDiv = document.createElement('div');
        const pageImgDiv = document.createElement('div');
        const pageimg = document.createElement('img');
        const pageNameDiv = document.createElement('div');
        const currentPosition = document.getElementById('page');
        const byerror = document.createElement('object');
        byerror.setAttribute('data', `https://sub60.tobit.com/l/${pageicon}?size=57`);
        byerror.setAttribute('type', 'image/png');
        pageDiv.classList.add('pageDiv');
        byerror.classList.add('byerrorpng');
        pageDiv.classList.add('onepagearea');
        pageImgDiv.classList.add('pageimg');
        pageDiv.onclick = () => {
            chayns.openUrlInBrowser(`http://chayns.net/${siteId}`);
        };
        pageimg.classList.add('img');
        pageimg.setAttribute('src', 'https://chayns.tobit.com/storage/75508-06235/Images/icon-57.png');
        pageNameDiv.classList.add('pagename');
        pageNameDiv.textContent = pagename;
        pageDiv.appendChild(pageImgDiv);
        pageDiv.appendChild(pageNameDiv);
        pageImgDiv.appendChild(byerror);
        byerror.appendChild(pageimg);
        currentPosition.appendChild(pageDiv);
    }
    chayns.hideWaitCursor();
    document.querySelector('.firsthide').classList.remove('hidden');
    const noMoreRoom = datas.length % 4;
    if (noMoreRoom > 0) {t
        document.querySelector('#loadMore').classList.add('hidden');
    } else {
        document.querySelector('#loadMore').classList.remove('hidden');
    }
};
//shownewpages
const ShowNewPages = (datas) => {
    const parentNode = document.getElementById('constant');
    const deletepage = document.getElementById('page');
    parentNode.removeChild(deletepage);
    const newPage = document.createElement('div');
    newPage.classList.add('pages');
    newPage.setAttribute('id', 'page');
    parentNode.appendChild(newPage);
    showpages(datas);
};

//loadpages
const loadpages = async (isnewpage = false) => {
    chayns.showWaitCursor();
    const data = await fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${lastsearch}&Skip=${skip}&Take=${lastTake}`);
    const body = await data.json();
    const cons = await body.Data;

    if (!isnewpage) {
        showpages(cons);
    } else {
        ShowNewPages(cons);
    }
};
