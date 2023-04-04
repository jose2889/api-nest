const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const credentials = process.env.AMBIENTE === 'prod' ? "clientSecretQA.json" : "clientSecretQA.json";
let client = require("../google/" + credentials);
const oAuthClient = new OAuth2(client.web.client_id, client.web.client_secret);
const jwt = require("jsonwebtoken");
const axios = require('axios');
oAuthClient.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        oAuthClient.setCredentials({
            refresh_token: tokens.refresh_token
        });
    } else if (tokens.access_token) {
        oAuthClient.setCredentials({
            access_token: tokens.access_token
        });
    }
});
const oauthcallbackController = async () => {
    try {
        let { tokens } = await oAuthClient.refreshToken(process.env.GOOGLE_REFRESH_TOKEN);
        if (tokens) {
            oAuthClient.setCredentials(tokens);
        }
        return true;
    } catch (error) {
        return false
    }
}

oauthcallbackController()

const createEventController = async (data) => {
    const calendar = google.calendar({ version: "v3", auth: oAuthClient });
    return new Promise((resolve, reject) => {
        try {
            const event = {
                organizer: {
                    displayName: data.business.name_busi
                },
                creator: {
                    email: data.creator.email,
                    displayName: data.creator.displayName
                },
                status: "confirmed",
                guestsCanInviteOthers: false,
                guestsCanModify: false,
                attendees: data.attendees,
                summary: data.summary,
                location: data.location,
                description: data.description,
                start: {
                    dateTime: data.start,
                    timeZone: data.timeZone
                },
                end: {
                    dateTime: data.end,
                    timeZone: data.timeZone
                },
                recurrence: [
                    'RRULE:FREQ=DAILY;COUNT=1'
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        {
                            method: "popup",
                            minutes: data.reminders.minutes
                        }
                    ]
                },
                source: {
                    url: `${process.env.WEB}/business/${data.business.slug_business}`,
                    title: data.business.name_busi
                },
                locked: true
            };
            calendar.events.insert({
                calendarId: "primary",
                sendNotifications: true,
                sendUpdates: 'all',
                resource: event
            }, (err, event) => {
                if (err) {
                    console.log("Error al crear el evento");
                    return resolve(false);
                }
                return resolve(event);
            });
        } catch (error) {
            console.log("Error al crear el evento II");
            return resolve(false);
        }
    });
};

const updateEventController = async (data) => {
    const calendar = google.calendar({ version: "v3", auth: oAuthClient });

    return new Promise((resolve, reject) => {
        try {
            const event = {
                organizer: {
                    displayName: data.business.name_busi
                },
                creator: {
                    email: data.creator.email,
                    displayName: data.creator.displayName
                },
                status: "confirmed",
                guestsCanInviteOthers: false,
                guestsCanModify: false,
                attendees: data.attendees,
                summary: data.summary,
                location: data.location,
                description: data.description,
                start: {
                    dateTime: data.start,
                    timeZone: data.timeZone
                },
                end: {
                    dateTime: data.end,
                    timeZone: data.timeZone
                },
                recurrence: [
                    'RRULE:FREQ=DAILY;COUNT=1'
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        {
                            method: "popup",
                            minutes: data.reminders.minutes
                        }
                    ]
                },
                source: {
                    url: `${process.env.WEB}/business/${data.business.slug_business}`,
                    title: data.business.name_busi
                },
                locked: true
            };
            calendar.events.update({
                calendarId: "primary",
                sendNotifications: true,
                sendUpdates: 'all',
                requestBody: event,
                eventId: data.eventId
            }, (err, event) => {
                if (err) {
                    console.log(err.errors ? err.errors : err)
                    console.log("Error al editar el evento");
                    return resolve(false);
                }
                return resolve(event);
            });
        } catch (error) {
            console.log("Error al editar el evento II");
            return resolve(false);
        }
    });
};

const deleteEventController = async (data) => {
    const calendar = google.calendar({ version: "v3", auth: oAuthClient });

    return new Promise((resolve, reject) => {
        try {
            calendar.events.delete({
                calendarId: "primary",
                sendNotifications: true,
                sendUpdates: 'all',
                eventId: data.eventId,
            }, (err, event) => {
                if (err) {
                    console.log("Error al eliminar el evento");
                    return resolve(false);
                }
                return resolve(event);
            });
        } catch (error) {
            console.log("Error al crear el evento II");
            return resolve(false);
        }
    });
};

const meetEventController = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payload = {
                iss: process.env.ZOOM_API_KEY, //your API KEY
                exp: new Date().getTime() + 5000,
            };
            const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);
            let options = {
                "topic": req.body.name_ser || "Meet Default",
                "type": 3,
                "settings": {
                    host_video: false,
                    join_before_host: true
                }
            };
            axios.post(`${process.env.ZOOM_URL}/v2/users/${encodeURI(process.env.ZOOM_HOSTID)}/meetings`, options, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'User-Agent': 'Zoom-api-Jwt-Request',
                    'content-type': 'application/json'
                }
            }).then((response) => {
                if (response) {
                    if (response.data) {
                        if (response.data.uuid) {
                            console.log("Conference created for event: %s", response.data.join_url);
                            return resolve({
                                link: response.data.join_url
                            });
                        } else {
                            return resolve(false);
                        }
                    } else {
                        return resolve(false);
                    }
                } else {
                    return resolve(false);
                }
            }).catch((e) => {
                console.log(e)
                return resolve(false);
            })
        } catch (error) {
            console.log("Error al crear conferencia en el evento II");
            return resolve(false);
        }
    });
};

const meetEventPatchController = async (data, req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const calendar = google.calendar({ version: "v3", auth: oAuthClient });
            const payload = {
                iss: process.env.ZOOM_API_KEY, //your API KEY
                exp: new Date().getTime() + 5000,
            };
            const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);
            let options = {
                "topic": req.body.name_ser || "Meet Default",
                "type": 3,
                "settings": {
                    host_video: false,
                    join_before_host: true
                }
            };
            axios.post(`${process.env.ZOOM_URL}/v2/users/${encodeURI(process.env.ZOOM_HOSTID)}/meetings`, options, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'User-Agent': 'Zoom-api-Jwt-Request',
                    'content-type': 'application/json'
                }
            }).then((response) => {
                if (response) {
                    if (response.data) {
                        if (response.data.uuid) {
                            const eventPatch = {
                                conferenceData: {
                                    conferenceSolution: {
                                        key: { type: "addOn" },
                                        name: "Zoom",
                                    },
                                    entryPoints: [
                                        {
                                            entryPointType: "video",
                                            passcode: response.data.password,
                                            uri: response.data.join_url,
                                        },
                                    ]
                                }
                            };
                            calendar.events.patch({
                                calendarId: "primary",
                                eventId: data.eventId,
                                requestBody: eventPatch,
                                conferenceDataVersion: 1,
                                sendNotifications: true,
                                sendUpdates: 'all'
                            }, (err, event) => {
                                if (err) {
                                    console.log("Error al crear conferencia en el evento");
                                    return resolve(false);
                                }
                                console.log("Conference created for event: %s", response.data.join_url);
                                return resolve({
                                    link: response.data.join_url
                                });
                            });
                        } else {
                            return resolve(false);
                        }
                    } else {
                        return resolve(false);
                    }
                } else {
                    return resolve(false);
                }
            }).catch((e) => {
                console.log(e)
                return resolve(false);
            })
        } catch (error) {
            console.log("Error al crear conferencia en el evento II");
            return resolve(false);
        }
    });
};


module.exports = {
    createEventController,
    deleteEventController,
    updateEventController,
    meetEventController,
    meetEventPatchController,
    oauthcallbackController
}