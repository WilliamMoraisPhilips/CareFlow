package com.example.oracleapi;

public class BairroDTO {
    private String bairroUF;
    private String bairroMunicipio;
    private String bairroNome;

    public String getBairroUF() {
        return bairroUF;
    }

    public void setBairroUF(String bairroUF) {
        this.bairroUF = bairroUF;
    }

    public String getBairroMunicipio() {
        return bairroMunicipio;
    }

    public void setBairroMunicipio(String bairroMunicipio) {
        this.bairroMunicipio = bairroMunicipio;
    }

    public String getBairroNome() {
        return bairroNome;
    }

    public void setBairroNome(String bairroNome) {
        this.bairroNome = bairroNome;
    }
}