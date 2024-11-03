function App() {
    document.addEventListener('DOMContentLoaded', function() {
        this.elements = {
            time: document.getElementById('js-build-time'),
            timeRender: document.getElementById('js-build-time-render'),
        }
        this.changeTimeToLocal();
    }.bind(this));
}
App.prototype = {
    changeTimeToLocal: function() {
        const serverDate = new Date(this.elements.time.getAttribute('data-time'));

        const localDate = serverDate.toLocaleDateString();
        const localTime = serverDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const result = `${localDate} ${localTime}`;

        this.elements.timeRender.innerHTML = result;
    }
}

window.leaderboardApp = new App();