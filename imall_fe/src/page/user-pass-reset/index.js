/*
* @Author: user
* @Date:   2017-07-22 18:09:50
* @Last Modified by:   user
* @Last Modified time: 2017-08-30 01:32:38
*/

'use strict';
require('./index.css');
var _im = require('util/im.js');
require('page/common/nav-simple/index.js');
var _user = require('service/user-service.js');

//表单里的错误提示
var formError = {
	show  :function(errMsg){
		$('.error-item').show().find('.err-msg').text(errMsg);
	},
	hide :function(){
		$('.error-item').hide().find('.err-msg').text();
	}
};
//page逻辑部分
var page = {
	data :{
		username : '',
		question : '',
		answer : '',
		token : '',
	},
	init:function(){
		this.bindEvent();
		this.onLoad();
	},
	onLoad : function(){
		this.loadStepUsername();
	},
	bindEvent :function(){
		var _this=this;
		//输入用户名中按钮点击
		$('#submit-username').click(function(){
			var username = $.trim($('#username').val());
			//判断用户名是否存在
			if(username){
				_user.getQuestion(username,function(res){
					_this.data.username = username;
					_this.data.question = res;
					_this.loadStepQuestion();
				},function(errMsg){
					formError.show(errMsg);
				})
			}else{
				formError.show('请输入用户名');
			}
		});
		//输入密码提示问题答案中按钮点击
		$('#submit-question').click(function(){
			var answer = $.trim($('#answer').val());
			//判断密码提示问题答案是否存在
			if(answer){
				_user.checkAnswer({
					username : _this.data.username,
					question : _this.data.question,
					answer   : answer
				},function(res){
					_this.data.answer = answer;
					_this.data.token = res;
					_this.loadStepPassword();
				},function(errMsg){
					formError.show(errMsg);
				})
			}else{
				formError.show('请输入密码提示问题答案');
			}
		});
        //输入新密码后按钮点击
		$('#submit-password').click(function(){
			var password = $.trim($('#password').val());
			//判断新密码是否存在
			if(password && password.length>=6){
				_user.resetPassword({
					username : _this.data.username,
					passwordNew : password,
					forgetToken : _this.data.token
				},function(res){
					window.location.href = './result.html?type=pass-reset';
				},function(errMsg){
					formError.show(errMsg);
				})
			}else{
				formError.show('请输入不少于6位的新密码');
			}
		});
	},
	//加载输入用户名的一步
	loadStepUsername : function(){
		$('.step-username').show();
	},
	//加载密码提示问题答案的一步
	loadStepQuestion : function(){
		formError.hide();
		$('.step-username').hide()
			.siblings('.step-question')
			.show().find('.question').text(this.data.question);
	},
	//加载输入新密码的一步
	loadStepPassword : function(){
		formError.hide();
		$('.step-question').hide()
			.siblings('.step-password').show();
	}
	
};

$(function(){
	page.init();
})
