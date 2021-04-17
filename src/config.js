exports.getConfigFields = function () {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target Schedule host',
			width: 5,
		},
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'First choose some credentials for the API in you schedule system settings ',
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'API username (Set in Schedule settings)',
			width: 6,
			default: '',
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'API password (Set in Schedule settings)',
			width: 6,
			default: '',
		},
	]
}
