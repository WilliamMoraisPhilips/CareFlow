package com.example.oracleapi;

import java.util.Date;

public class ProfissionalDTO {
    // Parameters for "contract"
    private ContratoDTO contrato;

    // Parameters for "address"
    private EnderecoDTO endereco;

    // Parameters for "professional"
    private Integer idSetor;
    private String nome;
    private String telefone;
    private String cpf;
    private String crm; // Optional
    private Date dataNascimento;
    private Integer idNivelAcesso;
    private Integer idCargo; // Use Integer, allowing null by default

    // Getters and Setters

    public Integer getIdCargo() {
        return idCargo;
    }

    public void setIdCargo(Integer idCargo) {
        this.idCargo = idCargo;
    }

    // Contract
    public ContratoDTO getContrato() {
        return contrato;
    }

    public void setContrato(ContratoDTO contrato) {
        this.contrato = contrato;
    }

    // Address
    public EnderecoDTO getEndereco() {
        return endereco;
    }

    public void setEndereco(EnderecoDTO endereco) {
        this.endereco = endereco;
    }

    // Professional
    public Integer getIdSetor() {
        return idSetor;
    }

    public void setIdSetor(Integer idSetor) {
        this.idSetor = idSetor;
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

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public Date getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(Date dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    // Getters and Setters
    public Integer getIdNivelAcesso() {
        return idNivelAcesso;
    }

    public void setIdNivelAcesso(Integer idNivelAcesso) {
        this.idNivelAcesso = idNivelAcesso;
    }

}
