var exec = require('child_process').exec;

var create = function() {
	return new pc();
};

var pc = function(cmd) {
	this.options = [];
	this.command = cmd;//'osx-cpu-temp';
};
pc.prototype.args = function(opt) {
	this.options.push(opt);
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