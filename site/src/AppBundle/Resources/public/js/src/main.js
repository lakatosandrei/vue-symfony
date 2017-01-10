const DPCluj = {template: '<div><deposit-station></deposit-station></div>'};
const DPNewYork = {template: '<div><deposit-station></deposit-station></div>'};
const routes = {
    '/': DPCluj,
    '/about': DPNewYork
};

const app = new Vue({
    el: '#app',
    data: {
        currentView: routes[location.hash.replace('#', '')] || DPCluj,
        currentRoute: location.hash.replace('#', '') || '/',
        dsCurrentId: 0,
        dsIds: {}
    },
    template: [
        '<keep-alive>',
        '    <component v-bind:is="currentView">',
        '    </component>',
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