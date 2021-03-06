const DPCluj = {
    template: [
        '<div class="view">',
        '    <a href="#/dp2">Deposit Station 2</a>',
        '    <deposit-station custom-id="0">',
        '    </deposit-station>',
        '</div>'
    ].join('')
};
const DPNewYork = {
    template: [
        '<div class="view">',
        '    <a href="#/">Deposit Station 1</a>',
        '    <deposit-station custom-id="1">',
        '    </deposit-station>',
        '</div>'
    ].join('')
};

const routes = {
    '/': DPCluj,
    '/dp2': DPNewYork
};

const app = new Vue({
    el: '#app',
    data: {
        currentView: routes[location.hash.replace('#', '')] || DPCluj,
        currentRoute: location.hash.replace('#', '') || '/',
        dsIds: {}
    },
    template: [
        '<keep-alive>',
        '<transition name="component-fade" mode="out-in">',
        '    <component v-bind:is="currentView">',
        '    </component>',
        '</transition>',
        '</keep-alive>'
    ].join(''),
    computed: {
        goTo: {
            get: function () {
                return this.currentRoute;
            },
            set: function (value) {
                if (routes[value]) {
                    this.currentView = routes[value]
                }
            }
        }
    }
});

window.onhashchange = function () {
    app.goTo = location.hash.replace('#', '');
};