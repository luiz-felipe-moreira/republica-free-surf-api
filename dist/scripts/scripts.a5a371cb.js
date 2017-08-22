"use strict";angular.module("cadastroRepublicaApp",["ngResource","ui.router","ui.mask"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("form",{url:"/form",templateUrl:"views/form.html",controller:"FormController",controllerAs:"formController"}).state("form.geral",{url:"/geral",templateUrl:"views/form-geral.html"}).state("form.saude",{url:"/saude",templateUrl:"views/form-saude.html"}).state("form.surfe",{url:"/surfe",templateUrl:"views/form-surfe.html"}).state("form.surfe",{url:"/surfe",templateUrl:"views/form-surfe.html"}).state("confirmacao",{url:"/confirmacao",templateUrl:"views/confirmacao-cadastro.html"}),b.otherwise("/")}]).run(["$rootScope","$window","authenticationService","$state","$location",function(a,b,c,d,e){a.$on("$stateChangeStart",function(b,c,e,f,g){console.log("Detectando mudança de state");var h="login"===c.name;h||"form.saude"===c.name&&a.generalStepCompleted===!1&&(console.log("Impedindo a mudança de página."),console.log("$rootScope.generalStepCompleted: "+a.generalStepCompleted),b.preventDefault(),d.go("form.geral"))}),a.user={},b.fbAsyncInit=function(){FB.init({appId:"386727121713923",status:!0,cookie:!0,xfbml:!0,version:"v2.8"}),c.watchAuthenticationStatusChange()},function(a,b,c){var d,e=a.getElementsByTagName(b)[0];a.getElementById(c)||(d=a.createElement(b),d.id=c,d.src="//connect.facebook.net/en_US/sdk.js",e.parentNode.insertBefore(d,e))}(document,"script","facebook-jssdk")}]),angular.module("cadastroRepublicaApp").controller("FormController",function(){var a=this;a.formData={dataNascimento:""},a.diaNascimento=null,a.mesNascimento=null,a.anoNascimento=null,a.atualizarDataNascimento=function(){a.formData.dataNascimento=new Date(a.anoNascimento,a.mesNascimento,a.diaNascimento)},a.atualizarDataNascimento()}),angular.module("cadastroRepublicaApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma","Jasmine"]}),angular.module("cadastroRepublicaApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("cadastroRepublicaApp").controller("CadastroController",[function(){this.dadosCadastrais={nome:"",apelido:"",email:"",telefoneCelular:"",telefoneFixo:!1,profissao:"",dataNascimento:"",sexo:""},this.enviar=function(){console.log("Nome: "+this.dadosCadastrais.nome)}}]),angular.module("cadastroRepublicaApp").controller("LoginController",["$window","$scope","$location","authenticationService",function(a,b,c,d){this.stringTeste=d.obterStringTeste(),this.usuario=JSON.stringify(d.user),a.onFBLoginCallBack=function(){console.log("Valor do authenticatin.isRegistered: "+d.isRegistered),d.isRegistered?c.path("/main"):c.path("/cadastro")},b.facebook={username:"",email:""},b.onFBLogin=function(){console.debug("Entrou na funcao onFBLogin"),c.path("/cadastro")}}]),angular.module("cadastroRepublicaApp").controller("HeaderController",["authenticationService",function(a){this.dadosCadastrais={nome:"",apelido:"",email:"",telefoneCelular:"",telefoneFixo:!1,profissao:"",dataNascimento:"",sexo:""},this.hideHeader=function(){return console.debug("Executando a função hideHeader. Valor de authenticationService.isRegistered: "+a.isRegistered),a.isRegistered===!1?(console.log("Usuário não cadastrado ou ainda não autenticado!!!"),!0):!1}}]),angular.module("cadastroRepublicaApp").service("authenticationService",["$rootScope",function(a){this.obterStringTeste=function(){return"string teste do serviço de autenticação"},this.user={},this.isRegistered=!1,this.watchAuthenticationStatusChange=function(){var a=this;FB.Event.subscribe("auth.authResponseChange",function(b){"connected"===b.status&&(a.getUserInfo(),console.debug("Alterando o valor de isRegistered para true"),a.isRegistered=!0)})},this.getUserInfo=function(){var b=this;FB.api("/me","GET",{fields:"email, first_name, name, id, picture"},function(c){a.$apply(function(){a.user=b.user=c})})},this.logout=function(){var b=this;FB.logout(function(c){a.$apply(function(){a.user=b.user={}})})}}]),angular.module("cadastroRepublicaApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/cadastro.html",'<form name="cadastroForm" role="form" ng-submit="cadastroController.enviar()" novalidate> <div id="passo1"> <div class="row"> <h3>Dados Pessoais</h3> </div> <div class="form-group" ng-class="{ \'has-error\' : cadastroForm.inputNome.$error.required && !cadastroForm.inputNome.$pristine }"> <label for="inputNome">Nome</label> <input type="text" class="form-control" id="inputNome" name="inputNome" placeholder="Seu nome completo" ng-model="cadastroController.dadosCadastrais.nome" required> <span class="help-block" ng-show="cadastroForm.inputNome.$error.required && !cadastroForm.inputNome.$pristine">É obrigatório informar o seu nome!</span> </div> <div class="form-group"> <label for="inputApelido">Apelido <small>(opcional)</small></label> <input type="text" class="form-control" id="inputApelido" placeholder="Seu apelido no República Free Surf" ng-model="cadastroController.dadosCadastrais.apelido"> </div> <div class="form-group" ng-class="{ \'has-error has-feedback\' : cadastroForm.inputEmail.$invalid && !cadastroForm.inputEmail.$pristine }"> <label for="inputEmail">Email</label> <input type="email" class="form-control" id="inputEmail" name="inputEmail" placeholder="Seu endereço de email" ng-model="cadastroController.dadosCadastrais.email" required> <span ng-show="(cadastroForm.inputEmail.$invalid ||\n                                          cadastroForm.inputEmail.$error.required) &&\n                                          !cadastroForm.inputEmail.$pristine" class="help-block">É obrigatório informar um endereço de email válido</span> </div> <div class="form-group"> <label for="inputProfissao">Profissão</label> <input type="text" class="form-control" id="inputProfissao" placeholder="Sua ocupação principal" ng-model="cadastroController.dadosCadastrais.profissao" required> </div> <div class="form-group"> <label for="inputGroupDia">Data de Nascimento</label> <div class="input-group" id="inputGroupDia"> <div class="col-xs-3" style="padding-left: 0px"><input class="form-control" placeholder="dia" type="text" maxlength="2"></div> <div class="col-xs-5" style="padding-left: 0px"> <select class="form-control"> <option>Janeiro</option> <option>Fevereiro</option> <option>Março</option> <option>Abril</option> <option>Maio</option> <option>Junho</option> <option>Julho</option> <option>Agosto</option> <option>Setembro</option> <option>Maio</option> <option>Maio</option> </select> </div> <div class="col-xs-4" style="padding-left: 0px"><input class="form-control" placeholder="ano" type="text" maxlength="4"></div> </div> </div> <div class="form-group"> <label for="radioButttons">Sexo</label> <div id="radioButttons"> <label class="radio-inline"> <input type="radio" id="inlineRadio1" value="option1"> Masculino </label> <label class="radio-inline"> <input type="radio" id="inlineRadio2" value="option2"> Feminino </label> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="form-group" ng-class="{ \'has-error\' : cadastroForm.inputTelefoneCelular.$error.required && !cadastroForm.inputTelefoneCelular.$pristine }"> <label for="inputTelefoneCelular">Telefone Celular</label> <input type="text" class="form-control" id="inputTelefoneCelular" name="inputTelefoneCelular" ng-model="cadastroController.dadosCadastrais.telefoneCelular" ui-mask="(99) 99999-9999" ui-mask-placeholder ui-mask-placeholder-char="_" required> <span class="help-block" ng-show="cadastroForm.inputTelefoneCelular.$error.required && !cadastroForm.inputTelefoneCelular.$pristine">É obrigatório informar o seu celular!</span> </div> </div> <div class="col-xs-6" style="padding-left: 0px"> <div class="form-group"> <label for="inputTelefoneFixo">Tel. Fixo <small>(opcional)</small></label> <input type="text" class="form-control" id="inputTelefoneFixo" ng-model="cadastroController.dadosCadastrais.telefoneFixo" ui-mask="(99) 9999-9999" ui-mask-placeholder ui-mask-placeholder-char="_"> </div> </div> </div> <div class="row"> <div class="col-xs-offset-3 col-xs-6"> <button type="submit" class="btn btn-primary btn-block" ng-disabled="cadastroForm.$invalid">Próximo passo</button> </div> </div> </div> <div id="passo2"> <div class="row"> <h3>Saúde</h3> </div> <div class="form-group"> <label for="inputDoencas">Possui doenças preexistentes? Se sim, informe quais.</label> <input type="text" class="form-control" id="inputDoenca" name="inputDoencas" ng-model="cadastroController.dadosCadastrais.doencas"> </div> </div> </form>'),a.put("views/confirmacao-cadastro.html",'<div class="text-center"> <span class="glyphicon glyphicon-heart"></span> <h3>Cadastro realizado com sucesso!</h3> </div>'),a.put("views/form-geral.html",'<!-- form-geral.html --> <div id="form-header" class="page-header text-center"> <h2>Let\'s Be Friends</h2> <div id="status-buttons" class="text-center"> <a class="active"><span>1</span> Geral</a> <a><span>2</span> Saúde</a> <a><span>3</span> Surfe</a> </div> </div> <div class="form-group" ng-class="{ \'has-error\' : form.inputNome.$error.required && !form.inputNome.$pristine }"> <label for="inputNome">Nome</label> <input type="text" class="form-control" id="inputNome" name="inputNome" placeholder="Seu nome completo" ng-model="formController.formData.nome" required> <span class="help-block" ng-show="form.inputNome.$error.required && !form.inputNome.$pristine">É obrigatório informar o seu nome!</span> </div> <div class="form-group"> <label for="inputApelido">Apelido <small>(opcional)</small></label> <input type="text" class="form-control" id="inputApelido" placeholder="Seu apelido no República Free Surf" ng-model="formController.formData.apelido"> </div> <div class="row"> <div class="col-xs-6"> <div class="form-group" ng-class="{ \'has-error\' : form.inputTelefoneCelular.$error.required && !form.inputTelefoneCelular.$pristine }"> <label for="inputTelefoneCelular">Telefone Celular</label> <input type="text" class="form-control" id="inputTelefoneCelular" name="inputTelefoneCelular" ng-model="formController.formData.telefoneCelular" ui-mask="(99) 99999-9999" ui-mask-placeholder ui-mask-placeholder-char="_" required> <span class="help-block" ng-show="form.inputTelefoneCelular.$error.required && !form.inputTelefoneCelular.$pristine">É obrigatório o seu celular, com DDD e 9 dígitos no número!</span> </div> </div> <div class="col-xs-6" style="padding-left: 0px"> <div class="form-group"> <label for="inputTelefoneFixo">Tel. Fixo <small>(opcional)</small></label> <input type="text" class="form-control" id="inputTelefoneFixo" ng-model="formController.formData.telefoneFixo" ui-mask="(99) 9999-9999" ui-mask-placeholder ui-mask-placeholder-char="_"> </div> </div> </div> <div class="form-group" ng-class="{ \'has-error has-feedback\' : form.inputEmail.$invalid && !form.inputEmail.$pristine }"> <label for="inputEmail">Email</label> <input type="email" class="form-control" id="inputEmail" name="inputEmail" placeholder="Seu endereço de email" ng-model="formController.formData.email" required> <span ng-show="(form.inputEmail.$invalid ||\n                                          form.inputEmail.$error.required) &&\n                                          !form.inputEmail.$pristine" class="help-block">É obrigatório informar um endereço de email válido</span> </div> <div class="form-group" ng-class="{ \'has-error\' : form.inputProfissao.$error.required && !form.inputProfissao.$pristine }"> <label for="inputProfissao">Profissão</label> <input type="text" class="form-control" id="inputProfissao" name="inputProfissao" placeholder="Sua ocupação principal" ng-model="formController.formData.profissao" required> <span class="help-block" ng-show="form.inputProfissao.$error.required && !form.inputProfissao.$pristine">É obrigatório informar sua profissão!</span> </div> <div class="form-group"> <label for="inputGroupDia">Data de Nascimento</label> <div class="input-group" id="inputGroupDia"> <div class="col-xs-3" style="padding-left: 0px" ng-class="{ \'has-error\' : (form.diaNascimento.$error.required || form.diaNascimento.$error.max) && !form.diaNascimento.$pristine }"> <input class="form-control" placeholder="dia" type="number" name="diaNascimento" min="1" max="31" maxlength="2" required only-digits ng-model="formController.diaNascimento" ng-change="formController.atualizarDataNascimento()"> <span class="help-block" ng-show="(form.diaNascimento.$error.required || form.diaNascimento.$error.max) && !form.diaNascimento.$pristine">Informe um dia de nascimento válido!</span> </div> <div class="col-xs-5" style="padding-left: 0px"> <select class="form-control" required ng-model="formController.mesNascimento" ng-change="formController.atualizarDataNascimento()"> <option value="" disabled selected>mês</option> <option value="0">Janeiro</option> <option value="1">Fevereiro</option> <option value="2">Março</option> <option value="3">Abril</option> <option value="4">Maio</option> <option value="5">Junho</option> <option value="6">Julho</option> <option value="7">Agosto</option> <option value="8">Setembro</option> <option value="9">Outubro</option> <option value="10">Novembro</option> <option value="11">Dezembro</option> </select> </div> <div class="col-xs-4" style="padding-left: 0px"> <input class="form-control" placeholder="ano" type="number" min="1900" max="2050" maxlength="4" required only-digits ng-model="formController.anoNascimento" ng-change="formController.atualizarDataNascimento()"> </div> </div> </div> <div class="form-group"> <label for="radioButtonsSexo">Sexo</label> <div id="radioButtonsSexo" ng-init="formController.formData.sexo=\'M\'"> <label class="radio-inline"> <input type="radio" id="inlineRadio1" value="M" ng-model="formController.formData.sexo"> Masculino </label> <label class="radio-inline"> <input type="radio" id="inlineRadio2" value="F" ng-model="formController.formData.sexo"> Feminino </label> </div> </div> <div class="form-group row"> <div class="col-xs-6 col-xs-offset-3"> <a ui-sref="form.saude" class="btn btn-block btn-info" ng-disabled="\n    form.$invalid"> Próximo passo <span class="glyphicon glyphicon-circle-arrow-right"></span> </a> </div> </div>'),a.put("views/form-saude.html",'<!-- form-saude.html --> <div id="form-header" class="page-header text-center"> <h2>Let\'s Be Friends</h2> <div id="status-buttons" class="text-center"> <a><span>1</span> Geral</a> <a class="active"><span>2</span> Saúde</a> <a><span>3</span> Surfe</a> </div> </div> <div class="form-group row"> <div class="col-xs-6"> <label for="selectGrupoSanguineo">Grupo Sanguíneo</label> <select class="form-control" id="selectGrupoSanguineo" name="selectGrupoSanguineo" required ng-model="formController.formData.grupoSanguineo"> <option value="" disabled>selecione</option> <option value="A">A</option> <option value="AB">AB</option> <option value="B">B</option> <option value="O">O</option> </select> </div> </div> <div class="form-group"> <label for="radioButtonsFatorRH">Fator RH</label> <div id="radioButtonsFatorRH" ng-init="formController.formData.fatorRH=\'+\'"> <label class="radio-inline"> <input type="radio" ng-model="formController.formData.fatorRH" value="+"> + Positivo </label> <label class="radio-inline"> <input type="radio" ng-model="formController.formData.fatorRH" value="-"> - Negativo </label> </div> </div> <div class="form-group"> <label for="inputAlergias">Alergias <small>(opcional)</small></label> <input type="text" class="form-control" id="inputAlergias" name="inputAlergias" placeholder="ex.: AAS, dipirona, camarão" ng-model="formController.formData.alergias"> </div> <div class="form-group"> <label for="inputProblemasSaude">Problemas de Saúde <small>(opcional)</small></label> <input type="text" class="form-control" id="inputProblemasSaude" name="inputProblemasSaude" placeholder="ex.: diabetes, eplepsia, hipertensão" ng-model="formController.formData.problemasSaude"> </div> <fieldset> <legend id="legendContatoEmergencia">Contato de Emergência</legend> <div class="form-group"> <small>Informe abaixo os dados da pessoa que deve ser comunicada em caso de acidente</small> </div> <div class="form-group" ng-class="{ \'has-error\' : form.inputNomeContatoEmergencia.$error.required && !form.inputNomeContatoEmergencia.$pristine }"> <label for="inputNomeContatoEmergencia">Nome</label> <input type="text" class="form-control" id="inputNomeContatoEmergencia" name="inputNomeContatoEmergencia" placeholder="Nome do contato de emergêcia" ng-model="formController.formData.nomeContatoEmergencia" required> <span class="help-block" ng-show="form.inputNomeContatoEmergencia.$error.required && !form.inputNomeContatoEmergencia.$pristine">É obrigatório informar o nome do seu contato de emergência!</span> </div> <div class="form-group col-xs-6" style="padding-left: 0px" ng-class="{ \'has-error\' : form.inputelefoneContatoEmergencia.$error.required && !form.inputelefoneContatoEmergencia.$pristine\n}"> <label for="inputelefoneContatoEmergencia">Telefone Celular</label> <input type="text" class="form-control" id="inputelefoneContatoEmergencia" name="inputelefoneContatoEmergencia" ng-model="formController.formData.telefoneContatoEmergencia " ui-mask="(99) 99999-9999" ui-mask-placeholder ui-mask-placeholder-char="_" required> <span class="help-block" ng-show="form.inputelefoneContatoEmergencia.$error.required && !form.inputelefoneContatoEmergencia.$pristine ">É obrigatório informar um celular, com DDD e 9 dígitos no número!</span> </div> </fieldset> <div class="form-group row"> <div class="col-xs-6 col-xs-offset-3"> <a ui-sref="form.payment " class="btn btn-block btn-info" ng-disabled=" form.$invalid "> Próximo Passo <span class="glyphicon glyphicon-circle-arrow-right"></span> </a> </div> </div>'),a.put("views/form-surfe.html",'<!-- form-surfe.html --> <div id="form-header" class="page-header text-center"> <h2>Let\'s Be Friends</h2> <div id="status-buttons" class="text-center"> <a><span>1</span> Geral</a> <a><span>2</span> Saúde</a> <a class="active"><span>3</span> Surfe</a> </div> </div> <div class="form-group"> <label for="checkboxesModalidade">Modalidade praticada</label> <div id="checkboxesModalidade"> <div class="checkbox"> <label> <input type="checkbox" value="sup"> Stand Up Paddle </label> </div> <div class="checkbox"> <label> <input type="checkbox" value="longboard"> Longboard </label> </div> <div class="checkbox"> <label> <input type="checkbox" value="shortboard"> Shortboard (pranchinha) </label> </div> <div class="checkbox"> <label> <input type="checkbox" value="bodyboard"> Bodyboard </label> </div> <div class="checkbox"> <label> <input type="checkbox" value="outra"> Outra </label> </div> </div> </div> <div class="form-group"> <label for="radioButtonsNivel">Nível de surfe</label> <div id="radioButtonsNivel"> <div class="radio"> <label> <input type="radio" name="nivel" id="nivelIniciante" value="iniciante"> Iniciante </label> </div> <div class="radio"> <label> <input type="radio" name="nivel" id="nivelIntermediario" value="intermediario"> Intermediário </label> </div> <div class="radio"> <label> <input type="radio" name="nivel" id="nivelAvancado" value="avancado"> Avançado </label> </div> <div class="radio"> <label> <input type="radio" name="nivel" id="nivelProfissional" value="profissional"> Profissional </label> </div> </div> </div> <div class="form-group"> <label for="inputAnoComecoSurfe">Ano em que começou a surfar</label> <small>(se não lembrar o ano exato, informe um ano aproximado)</small> <input class="form-control" id="inputAnoComecoSurfe" style="width: 50%" placeholder="ano" type="number" min="1900" max="2050" maxlength="4" required only-digits ng-model="formController.anoComecoSurfe"> </div> <div class="form-group" ng-class="{ \'has-error\' : form.inputPraia.$error.required && !form.inputPraia.$pristine }"> <label for="inputPraia">Praia de preferência para o surfe</label> <input type="text" class="form-control" id="inputPraia" name="inputPraia" placeholder="ex.: Praia de Jaguaribe" ng-model="formController.formData.praia" required> <span class="help-block" ng-show="form.inputPraia.$error.required && !form.inputPraia.$pristine">É obrigatório informar o nome da praia!</span> </div> <div class="form-group row"> <div class="col-xs-6 col-xs-offset-3"> <a ui-sref="confirmacao" class="btn btn-block btn-primary" ng-disabled="\n    form.$invalid"> Concluir </a> </div> </div> <div class="text-center"> <span class="glyphicon glyphicon-heart"></span> <h3>Thanks For Your Money!</h3> <button type="submit" class="btn btn-danger">Submit</button> </div>'),a.put("views/form.html",'<!-- form.html --> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div id="form-container"> <!-- use ng-submit to catch the form submission and use our Angular function --> <form id="signup-form" name="form" role="form" ng-submit="processForm()" novalidate> <!-- our nested state views will be injected here --> <div id="form-view" ui-view></div> </form> </div> <!-- show our formData as it is being typed --> <pre>\n            {{ formController.formData }}\n        </pre> </div> </div>'),a.put("views/login.html",'<div class="row"> <img src="/images/republica-free-surf.5aefe7e6.png" class="img-responsive"> </div> <div class="row"> <input type="button" ng-click="onFBLogin()" value="Login usuário não cadastrado"> </div> <div class="row"> <!--\n    <fb:login-button show-faces="true" max-rows="1"\n        size="large" onlogin="onFBLoginCallBack()"></fb:login-button>\n        --> <div class="fb-login-button" data-max-rows="1" data-size="large" data-show-faces="false" data-auto-logout-link="true" onlogin="onFBLoginCallBack()"></div> </div> <div class="row"> <img ng-src="{{facebook.fb_image}}" style="width: 100px; height: 100px"> <p>{{facebook.username}}</p> <p>{{facebook.email}}</p> <p>URL da imagem: {{facebook.fb_image}}</p> </div> <div class="row"> <p>Usuário vindo do servico de autenticação: {{loginController.usuario}}</p> <p>Do objeto user no rootScope: {{user}}</p> </div>'),a.put("views/main.html",'<div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <p class="lead"> <img src="images/yeoman.c582c4d1.png" alt="I\'m Yeoman"><br> Always a pleasure scaffolding your apps. </p> <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p> <p>Você já está cadastrado no República Free Surf</p> <!-- objeto $rootScope.user --> <p>User: {{user}}</p> </div> <div class="row marketing"> <h4>HTML5 Boilerplate</h4> <p> HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites. </p> <h4>Angular</h4> <p> AngularJS is a toolset for building the framework most suited to your application development. </p> <h4>Karma</h4> <p>Spectacular Test Runner for JavaScript.</p> </div>')}]);