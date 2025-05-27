package com.example.oracleapi;

public class FormDataDTO {
    private String nome;
    private String telefone;
    private String cpf;
    private String crmCoren;
    private String dataNascimento;
    private EnderecoDTO endereco;
    private ContratoDTO contrato;
    private String setor;
    private String cargo;
    private String nivelAcesso;
    private String formacao;
    private String[] especializacao;

    public EnderecoDTO getEndereco() {
        return endereco;
    }

    public void setEndereco(EnderecoDTO endereco) {
        this.endereco = endereco;
    }

    public ContratoDTO getContrato() {
        return contrato;
    }

    public void setContrato(ContratoDTO contrato) {
        this.contrato = contrato;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCrmCoren() {
        return crmCoren;
    }

    public void setCrmCoren(String crmCoren) {
        this.crmCoren = crmCoren;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getNivelAcesso() {
        return nivelAcesso;
    }

    public void setNivelAcesso(String nivelAcesso) {
        this.nivelAcesso = nivelAcesso;
    }

    public String getFormacao() {
        return formacao;
    }

    public void setFormacao(String formacao) {
        this.formacao = formacao;
    }

    public String[] getEspecializacao() {
        return especializacao;
    }

    public void setEspecializacao(String[] especializacao) {
        this.especializacao = especializacao;
    }

}