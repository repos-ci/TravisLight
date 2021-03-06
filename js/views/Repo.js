/*global window: true */
define(
    [
        'text!templates/repoList.html',
        'underscore',
        'jquery',
        'backbone'
    ],
    function (template, _, $, Backbone) {
        "use strict";

        return Backbone.View.extend({
            tagName: 'ul',
            className: 'repos unstyled',
            template: _.template(template),

            initialize: function (options) {
                this.repoCollection = options.repoCollection;
                this.ventilator = options.ventilator;
            },

            render: function () {
                $('body').addClass('loading');

                this.$el.html(this.template({
                    collection: this.repoCollection.presenter()
                }));
            },

            autoFetch: function () {
                var that = this;

                if (false === $(this.el).is(':visible')) {
                    $('body').removeClass('loading');

                    return;
                }

                this.repoCollection.fetch().done(function () {
                    $('body').removeClass('loading');

                    if (0 === that.repoCollection.length) {
                        that.ventilator.trigger('navigate:index');
                        that.ventilator.trigger(
                            'canvas:message:error',
                            "Can't find any repositories for the given user, sorry."
                        );

                        return;
                    }

                    that.render();

                    window.setTimeout(function () {
                        that.autoFetch();
                    }, 30000);
                });
            }
        });
    }
);
