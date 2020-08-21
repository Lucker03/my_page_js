import './app.scss';

let lastsearch = 'Ahaus';
let lastTake = 20;

chayns.ready.then(() => {
    console.log('Chayns is ready, environment loaded', chayns.env);
    chayns.ui.initAll();
    setEventlister('#loadMore', '#textInp');
    loadpages();
}).catch(() => {
    console.warn('No chayns environment found');
}).then(() => {
    console.log('Will always be executed');
});

const setEventlister = (buttonid, suchId) => {
    document.querySelector(buttonid).addEventListener('click', loadMore);
    document.querySelector(suchId).addEventListener('change', search);

    document.querySelector('#ready').addEventListener('click', formular);
};

const formular = () => {
    const name = document.querySelector('#name').value;
    const mail = document.querySelector('#mail').value;
    const url = document.querySelector('#url').value;
    const comment = document.querySelector('#comment').value;

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
        chayns.dialog.alert('Hinweis', 'Name und Email sind pflicht!').then(console.log);
    }
};

const search = () => {
    lastTake = 20;
    const output = document.querySelector('#textInp').value;
    lastsearch = output;
    loadpages(true);
};

const loadMore = () => {
    lastTake += 20;
    loadpages(true);
};

const showpages = (datas) => {
    for (let i = 0; i < datas.length; i += 1) {
        let name = datas[i].appstoreName;
        const pageicon = datas[i].locationId;
        const siteId = datas[i].siteId;

        if (name.length >= 13) {
            name = name.substring(0, 10);
            name += '...';
        }
        const pageDiv = document.createElement('div');
        const pageImgDiv = document.createElement('div');
        const pageimg = document.createElement('img');
        const pageNameDiv = document.createElement('div');
        const currentPosition = document.getElementById('page');
        const byerror = document.createElement('object');
        byerror.setAttribute('data', `https://sub60.tobit.com/l/${pageicon}?size=57`);
        byerror.setAttribute('type', 'image/png');
        byerror.classList.add('byerrorpng');
        pageDiv.classList.add('onepagearea');
        pageImgDiv.classList.add('pageimg');
        pageImgDiv.onclick = () => {
            chayns.openUrlInBrowser(`http://chayns.net/${siteId}`);
        };
        pageimg.classList.add('img');
        pageimg.setAttribute('src', 'https://chayns.tobit.com/storage/75508-06235/Images/icon-57.png');
        pageNameDiv.classList.add('pagename');
        pageNameDiv.textContent = name;
        pageDiv.appendChild(pageImgDiv);
        pageDiv.appendChild(pageNameDiv);
        pageImgDiv.appendChild(byerror);
        byerror.appendChild(pageimg);
        currentPosition.appendChild(pageDiv);
    }
};

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

const loadpages = async (isnewpage = false) => {
    const data = await fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${lastsearch}&Skip=0&Take=${lastTake}`);
    const body = await data.json();
    const cons = await body.Data;

    if (!isnewpage) {
        showpages(cons);
    } else {
        ShowNewPages(cons);
    }
};
