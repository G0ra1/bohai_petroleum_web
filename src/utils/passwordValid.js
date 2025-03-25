export function passwordValid(userName, pass) {

  var passLower = pass.toLocaleLowerCase();

  var flag = ' ' ;

  if (pass == null || pass.length < 12 || pass.length > 20 || pass.length == '') {

//$.messager.alert("错误","密码位数不对，长度最少8位，最大20位。");

    flag = '密码位数不对，长度最少8位，最大20位';

    return flag;

  }

// 判断是否默认密码

// if (isDefaultPass(userName, pass))

// {

// return "密码为默认密码或弱口令";

// }

// 是数字

  var isDigit = /^.*[0-9]+.*/;

// isLowerCase 小写字母

  var isLowerCase = /^.*[a-z]+.*/;

// isUpperCase 大写字母

  var isUpperCase = /^.*[A-Z]+.*/;

// 特殊字符

  var regEx = /^.*[^a-zA-Z0-9]+.*/;

// 记录匹配的次数

  var num = 0;

  if (isDigit.test(pass)) {

    num = num + 1;

  }

  if (isLowerCase.test(pass)) {

    num = num + 1;

  }

  if (isUpperCase.test(pass)) {

    num = num + 1;

  }

  if (regEx.test(pass)) {

    num = num + 1;

  }

  if (num <= 2) {

//$.messager.alert("错误","密码复杂度不足,\n(1)大写字母\n(2)小写字母\n(3)数字\n(4)特殊符号\n密码至少需包含上述情形中的三种.");

    flag = '密码复杂度不足,\n(1)大写字母\n(2)小写字母\n(3)数字\n(4)特殊符号\n密码至少需包含上述情形中的三种';

    return flag;

  }

//新密码中不能够包含帐户。

  if (pass.indexOf(userName) >= 0) {

//$.messager.alert("错误","新密码不能包含用户名.");

    flag = '新密码不能包含用户名';

    return flag;

  }

//密码中不能包含有连续四位及以上顺序(或逆序)数字(如：密码中不能包含1234或3210等)。

  var numberSequence = false;

  for (var i = 0; i < pass.length - 3; i++) {

    if (!isDigit.test(pass.substring(i, i + 1)) || !isDigit.test(pass.substring(i + 1, i + 2) + "") || !isDigit.test(pass.substring(i + 2, i + 3) + "") || !isDigit.test(pass.substring(i + 3, i + 4) + "")) {

      continue;

    }

    var no1 = Number(pass.substring(i, i + 1));

    var no2 = Number(pass.substring(i + 1, i + 2));

    var no3 = Number(pass.substring(i + 2, i + 3));

    var no4 = Number(pass.substring(i + 3, i + 4));

    if (no1 + 1 == no2 && no2 + 1 == no3 && no3 + 1 == no4) {

      numberSequence = true;

    }

    if (no2 + 1 == no1 && no3 + 1 == no2 && no4 + 1 == no3) {

      numberSequence = true;

    }

  }

  if (numberSequence) {

// $.messager.alert("错误","密码中不能包含有连续四位及以上顺序(或逆序)数字(如：密码中不能包含1234或3210等)。");

    flag = '密码中不能包含有连续四位及以上顺序(或逆序)数字(如：密码中不能包含1234或3210等';

    return flag;

  }

//密码中不能包含有连续四位及以上顺序(或逆序)字母，字母不区分大小写(如：密码中不能包含abcd或ABCD或AbcD或DcbA等)。

  var letterSequence = false;

  for (var i = 0; i < passLower.length - 3; i++) {

    if (!isLowerCase.test(passLower.substring(i, i + 1)) || !isLowerCase.test(passLower.substring(i + 1, i + 2) + "") || !isLowerCase.test(passLower.substring(i + 2, i + 3) + "") || !isLowerCase.test(passLower.substring(i + 3, i + 4) + "")) {

      continue;

    }

    var no1 = passLower.charAt(i).charCodeAt() + 0;

    var no2 = passLower.charAt(i + 1).charCodeAt() + 0;

    var no3 = passLower.charAt(i + 2).charCodeAt() + 0;

    var no4 = passLower.charAt(i + 3).charCodeAt() + 0;

    if (no1 + 1 == no2 && no2 + 1 == no3 && no3 + 1 == no4) {

      letterSequence = true;

    }

    if (no2 + 1 == no1 && no3 + 1 == no2 && no4 + 1 == no3) {

      letterSequence = true;

    }

  }

  if (letterSequence) {

//$.messager.alert("错误","密码中不能包含有连续四位及以上顺序(或逆序)字母，字母不区分大小写(如：密码中不能包含abcd或ABCD或AbcD或DcbA等)。");

    flag = '密码中不能包含有连续四位及以上顺序(或逆序)字母，字母不区分大小写(如：密码中不能包含abcd或ABCD或AbcD或AbcD或DcbA等';

    return flag;

  }

//密码中不能包含有连续四位及以上重复字符，字母不区分大小写(如：密码中不能包含8888、aaaa 或AAAA或BbbB或 $$$$等四位及以上的重复字符)。

  var fourOrMoreSame = false;

  for (var i = 0; i < pass.length - 3; i++) {

    if ((passLower.charAt(i)) == passLower.charAt(i + 1) &&

      passLower.charAt(i + 1) == passLower.charAt(i + 2) &&

      passLower.charAt(i + 2) == passLower.charAt(i + 3)) {

      fourOrMoreSame = true;

    }

  }

  if (fourOrMoreSame) {

//  $.messager.alert("错误","密码中不能包含有连续四位及以上重复字符，字母不区分大小写(如：密码中不能包含8888、aaaa 或AAAA或BbbB或 $$$$等四位及以上的重复字符)。");

    flag = '密码中不能包含有连续四位及以上重复字符，字母不区分大小写(如：密码中不能包含8888、aaaa 或AAAA或BbbB或 $$$$等四位及以上的重复字符';

    return flag;

  }

  var cont = /^.*admin.*$/;

  var cont2 = /^.*pass.*$/;

//禁忌词不区分大小写不能作为密码的一部分存在于密码中(如：admin, pass)。

  if (cont.test(passLower) || cont2.test(passLower)) {

//  $.messager.alert("错误","禁忌词不区分大小写不能作为密码的一部分存在于密码中(如：admin, pass)。");

    flag = '禁忌词不区分大小写不能作为密码的一部分存在于密码中(如：admin, pass)';

    return flag;

  }

  return 'correct';

}
