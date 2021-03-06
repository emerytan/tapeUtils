var installer = require('electron-installer-redhat')
var fs = require('fs')
var sh = require('shelljs')
var installerPath = './dist/installers'


if (!fs.existsSync(installerPath)) {
	sh.mkdir('-p', installerPath)
}

var options = {
	src: 'centos/pftapeutils-linux-x64/',
	dest: installerPath,
	arch: 'x86_64',
	icon: 'elecIcon_512x512.png',
	categories: ['Utilities']
}

console.log('Creating package (this may take a while)')

installer(options, function (err) {
	if (err) {
		console.error(err, err.stack)
		process.exit(1)
	}
	console.log('Successfully created package at ' + options.dest)
})
