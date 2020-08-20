import './app.scss';

chayns.ready.then(() => {
    console.log('Chayns is ready, environment loaded', chayns.env);
    chayns.ui.initAll();
    loadpages();
}).catch(() => {
    console.warn('No chayns environment found');
}).then(() => {
    console.log('Will always be executed');
});

async function loadpages() {
    const data = await fetch('https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=50');
    //const { body } = data;
    const body = await data.json();
  
    console.log(body);
}
