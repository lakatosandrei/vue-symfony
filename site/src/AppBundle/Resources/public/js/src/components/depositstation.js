Vue.component('deposit-station', {
    props: [
        'customId'
    ],
    created: function () {
        let me = this;

        ajax.get('/data/' + me.page + '/' + me.pageSize, {}, function (response) {
            let prevData,
                dsData,
                jsonBody;

            me.dsId = me.createId();
            prevData = localStorage.getItem('deposit-station-' + me.dsId);
            dsData = prevData && JSON.parse(prevData);

            try {
                jsonBody = JSON.parse(response);
            } catch (e) {
                console.log(e);
            }

            if (jsonBody) {
                me.dsData = jsonBody;

                if (dsData) {
                    me.navAction = dsData['navAction'];
                    me.showGroup = dsData['showGroup'];
                }

                me.loaded = true;
            }
        })
    },
    template: [
        '<div v-if="loaded" class="deposit-station">',
        '    <ul class="dep-st-list">',
        '        <label v-if="showGroup" @click="goBack">Back</label>',
        '<transition-group name="list" tag="p">',
        '        <li class="dep-st-item" v-for="patient in sortOrFilteredList" v-bind:key="patient">',
        '            <div v-if="navAction.group && !showGroup">',
        '                <label @click="displayGroup(patient)">{{ patient.name }}</label>',
        '            </div>',
        '            <div v-else>',
        '            <div class="v-mask" @click="showDetails(patient, $event)"></div>',
        '            <label>{{ patient.label }}</label>',
        '            <label>Tel: {{ patient.details.tel  }} <span v-if="!patient.details.tel">-</span></label>',
        '            <transition name="fade">',
        '            <label v-for="(detail, key) in patient.details" v-if="key !== \'tel\'" class="hidden" v-bind:class="{ show: patient.visible }">',
        '                {{ key }} - {{ detail }}',
        '            </label>',
        '            </transition>',
        '            </div>',
        '        </li>',
        '</transition-group>',
        '    </ul>',
        '    <ul class="dep-st-nav">',
        '        <ul class="dep-st-nav-list">',
        '            <li class="dep-st-nav-item" v-for="action in dsData.navigation">',
        '                <label @click="doAction(action)">{{ action.name }}</label>',
        '            </li>',
        '        </ul>',
        '    </ul>',
        '    <div class="more-btn" v-if="!dataOver" @click="loadMore">More</div>',
        '    <div class="search-bar" v-if="displaySearchBar">',
        '        <div class="v-mask" @click="displaySearchBar = false">x</div>',
        '        <input type="text" v-model="searchTerm">',
        '    </div>',
        '</div>'
    ].join(''),

    data: function () {
        return {
            searchTerm: null,
            dsId: null,
            dataOver: false,
            navAction: {},
            dsData: {},
            showGroup: null,
            loaded: false,
            page: 1,
            pageSize: 10,
            displaySearchBar: false
        };
    },

    methods: {
        createId: function () {
            let me = this,
                i;

            if (me.customId && !app.dsIds[me.customId]) {
                app.dsIds[me.customId] = true;
                return me.customId;
            }

            i = 0;

            while (true) {
                if (!app.dsIds[i]) {
                    app.dsIds[i] = true;
                    return i;
                }

                i++;
            }
        },
        saveState: function () {
            let me = this;

            localStorage.setItem('deposit-station-' + me.dsId, JSON.stringify({
                navAction: me.navAction,
                showGroup: me.showGroup
            }));
        },
        showDetails: function (patient) {
            Vue.set(patient, 'visible', !patient.visible);
        },
        doAction: function (action) {
            if (this.navAction === action) {
                this.displaySearchBar = true;
            }

            this.showGroup = null;
            this.navAction = action;

            this.saveState();
        },
        displayGroup: function (group) {
            this.showGroup = group.name;
            this.saveState();
        },
        goBack: function () {
            this.showGroup = null;
            this.saveState();
        },
        loadMore: function () {
            let me = this;

            ajax.get('/data/' + (++me.page) + '/' + me.pageSize, {}, function (response) {
                let jsonBody;

                try {
                    jsonBody = JSON.parse(response);
                } catch (e) {
                    console.log(e);
                }

                if (jsonBody) {
                    me.dsData.collections.patient = me.dsData.collections.patient.concat(jsonBody.collections.patient);
                    me.dataOver = jsonBody['data_over'];
                }
            })
        }
    },

    computed: {
        sortOrFilteredList: function () {
            let me = this,
                filterType = me.navAction.filter,
                grouped = me.navAction.group === true,
                list,
                allGroups;

            // If we don't have any data, we return an empty array
            if (!me['dsData']) {
                return [];
            }

            // If the user selected the "GROUP" button from the navigation bar
            if (grouped) {
                // We get all the groups from the data received
                allGroups = me['dsData']['collections']['patient'].reduce(function (groups, item) {
                    let groupObj = groups[item.group];

                    if (!groupObj) {
                        groups[item.group] = {
                            name: item.group,
                            active: item.status === 1,
                            items: []
                        };
                    } else {
                        if (groupObj.active) {
                            groupObj.active = item.status === 1;
                            groupObj.items.push(item);
                        }
                    }

                    return groups;
                }, {});

                // If the user already selected a specific group, we return the list of items from that group
                if (me.showGroup) {
                    list = allGroups[me.showGroup].items;
                } else {
                    // Otherwise we return the list of groups
                    list = allGroups;
                }
            } else {
                // If the user is not in the grouped navigation
                if (filterType) {
                    /*
                     If we have a filterType in the navAction, we filter the items by the specific values
                     */
                    list = me['dsData']['collections']['patient'].filter(function (patient) {
                        let retValue = true;

                        Object.keys(filterType).forEach(function (key) {
                            if (patient[key] !== filterType[key]) {
                                retValue = false;
                            }
                        });

                        return retValue;
                    });
                } else {
                    // Otherwise, we just return the unfiltered list
                    list = me['dsData']['collections']['patient'];
                }
            }

            if (me.searchTerm) {
                if (me.navAction['filterBox']) {
                    let filterBox = me.navAction['filterBox'];

                    list = list.filter(function (item) {
                        let ok = false;

                        filterBox.forEach(function (filter) {
                            filter['value'].forEach(function (byValue) {
                                if (item[byValue].toLowerCase().startsWith(me.searchTerm.toLowerCase())) {
                                    ok = true;
                                }
                            });
                        });

                        return ok;
                    });
                }
            }

            return list;
        }
    }
})