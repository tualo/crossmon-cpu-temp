var exec = require('child_process').exec;

var create = function() {
	return new pc();
};

var pc = function() {
	this.options = [];
	this.command = 'sensors';
};
pc.prototype.args = function(opt) {
	this.options.push(opt);
	return this;
}
pc.prototype.cmd = function(opt) {
	this.command = (opt);
	return this;
}
pc.prototype.exec = function(callback) {
	var self = this;
	var args = this.options.join(' ');
	var child = exec(this.command + ' '+ args  + ' ', function(err, stdout, stderr) {
		child.kill('SIGHUP');
		callback(err, stdout, stderr);
	});
};

module.exports = create;