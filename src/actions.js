import got from 'got'

export function getActions() {
	var self = this
	var skipOption = {}
	if (self.data.apiVersion > 0) {
		skipOption = {
			type: 'multidropdown',
			multiple: false,
			minSelection: 1,
			label: 'Skip strategy',
			id: 'strategy',
			tooltip: 'What do you want the skipping behavior to be?',
			default: 'snap',
			choices: [
				{ id: 'snap', label: 'Move all the following assets' },
				{ id: 'fix_next', label: 'Skip to the next asset, and creates a gap after it' },
			],
		}
	}

	var actions = {
		playback_toggle: {
			name: 'Toggle playback running',
			options: [
				{
					type: 'number',
					label: 'Start timestamp',
					id: 'startstamp',
					tooltip: 'Sets the start timestamp (in milliseconds) (optional)',
					min: 0,
					required: false,
					range: false,
				},
			],
			callback: async (event) => {
				var opt = event.options
				var cmd
				var apiEndpoint

				if (this.data.playoutRunning) {
					apiEndpoint = 'playout/stop'
					cmd = ''
				} else {
					apiEndpoint = 'playout/start'
					if (opt.startstamp != '' && opt.startstamp != 0) {
						cmd = '?timestamp=' + opt.startstamp
					} else {
						cmd = '?timestamp=NOW'
					}
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		},
		publish_toggle: {
			name: 'Toggle publishing',
			options: [],
			callback: async (event) => {
				var cmd
				var apiEndpoint

				if (this.data.playoutRunning) {
					if (this.data.publishRunning) {
						apiEndpoint = 'playout/unpublish'
						cmd = ''
					} else {
						apiEndpoint = 'playout/publish'
						cmd = ''
					}
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		},
		targets_toggle: {
			name: 'Toggle push targets',
			options: [
				{
					type: 'multidropdown',
					multiple: true,
					minSelection: 1,
					label: 'Push Targets',
					id: 'targetsSelect',
					tooltip: 'What push targets do you want to toggle?',
					default: 'select',
					choices: self.data.targets.concat({ id: 'select', label: 'Select a target' }),
				},
			],
			callback: async (event) => {
				var opt = event.options
				var cmd
				var apiEndpoint

				var actualSelectedTargets = opt.targetsSelect.filter((target) => target !== 'select')
				var someDisabled = this.data.targets
					.filter((target) => actualSelectedTargets.some((selected) => selected === target.id))
					.some((target) => !target.enabled)

				if (actualSelectedTargets.length > 0) {
					if (someDisabled) {
						apiEndpoint = 'targets/start'
					} else {
						apiEndpoint = 'targets/stop'
					}
					cmd = '?id=' + actualSelectedTargets.join('&id=')
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		},
		playback_skip: {
			name: 'Skip a playback element',
			options: [skipOption],
			callback: async (event) => {
				var opt = event.options
				var cmd
				var apiEndpoint

				if (!this.data.skipUsed) {
					apiEndpoint = 'playout/skip'
					if (this.data.apiVersion > 0) {
						cmd = '?strategy=' + opt.strategy
					} else {
						cmd = ''
					}

					this.data.skipUsed = true
					setTimeout(() => {
						this.data.skipUsed = false
						this.checkFeedbacks('skippableStatus')
					}, 2000)
					this.checkFeedbacks('skippableStatus')
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		},
		playback_ad: {
			name: 'Trigger an ad',
			options: [
				{
					type: 'number',
					label: 'Ad Length',
					id: 'adLength',
					tooltip: 'Sets the ad length (in seconds)',
					min: 0,
					max: 3600,
					default: 0,
					required: true,
					range: false,
				},
			],
			callback: async (event) => {
				var opt = event.options
				var cmd
				var apiEndpoint

				if (
					this.data.adRunning == 0 &&
					this.data.playoutRunning &&
					(this.data.currentItemType === 'livestream' || this.data.apiVersion > 3)
				) {
					apiEndpoint = 'playout/ad'
					cmd = '?adLength=' + opt.adLength
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		},
	}

	if (self.data.apiVersion == 2) {
		actions.breaking_news = {
			name: 'Toggle breaking live',
			options: [],
			callback: async (event) => {
				var opt = event.options
				var cmd
				var apiEndpoint

				if (!this.data.breakingNewsRunning) {
					apiEndpoint = 'breakinglive/start'
					cmd = ''
				} else {
					apiEndpoint = 'breakinglive/stop'
					cmd = ''
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		}
	} else if (self.data.apiVersion > 2) {
		actions.breaking_news = {
			name: 'Toggle breaking live',
			options: [
				{
					type: 'multidropdown',
					multiple: false,
					minSelection: 0,
					label: 'Live streams',
					id: 'livestreamSelect',
					tooltip: 'What livestream do you want to use?',
					default: 'select',
					choices: self.data.livestreams.concat({ id: 'select', label: 'Select a target' }),
				},
			],
			callback: async (event) => {
				var opt = event.options
				var cmd
				var apiEndpoint

				if (!this.data.breakingNewsRunning) {
					apiEndpoint = 'breakinglive/start'
					cmd = ''
				} else {
					apiEndpoint = 'breakinglive/stop'
					cmd = ''
				}
				if (this.data.apiVersion > 2 && opt.livestreamSelect !== 'select') {
					cmd = '?breakingliveId=' + opt.livestreamSelect
				}
				sendAction.bind(this)(apiEndpoint, cmd)
			},
		}
	}

	if (self.data.apiVersion > 3) {
		actions.cancel_ad = {
			name: 'Cancel an ad',
			options: [],
			callback: async (event) => {
				var cmd
				var apiEndpoint

				apiEndpoint = 'playout/cancelad'
				cmd = ''

				sendAction.bind(this)(apiEndpoint, cmd)
			},
		}
	}

	return actions
}

function sendAction(apiEndpoint, cmd) {
	this.log('info', 'action! ' + this.config + '    ' + this)
	if (typeof cmd !== 'undefined' && typeof apiEndpoint !== 'undefined') {
		var requestString =
			`https://${this.config.username}:${this.config.password}@${this.config.host}/api/v1/${apiEndpoint}` + cmd
		got
			.get(requestString)
			.then((res) => {
				if (res.statusCode === 200) {
					this.log('info', 'API Call success')
				}
			})
			.catch((err) => {
				this.updateStatus('connection_failure', err)
				this.log('info', 'Schedule API err:' + JSON.stringify(err))
			})
	}
}
