/* Ordem das linhas (estações) no mapa. Para mudar a ordem, troca-as aqui. */
const W=[
 LINHA_BASICO,
 LINHA_EULER,
 LINHA_FLEURY,
 LINHA_HAMILTON,
 LINHA_DIGRAFOS,
 LINHA_TIPO_TESTE,
 LINHA_RELAMPAGO,
 LINHA_JUSTIFICA,
 LINHA_EXAMES,
 LINHA_TREINO
];
W.find(w=>w.gen).steps=makeTreino();
