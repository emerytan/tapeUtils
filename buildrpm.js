var installer = require('electron-installer-redhat')

var options = {
	src: 'centos/app-linux-x64/',
	dest: 'dist/installers/',
	arch: 'x86_64',
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

