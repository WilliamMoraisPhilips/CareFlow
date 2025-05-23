package com.example.oracleapi;

import java.util.Date;

public class ContratoDTO {

    private String empresaContratante;
    private Date inicio;
    private Date termino;
    private Integer cargaHorariaSemanal;
    private Double valorMensal; // Ajustar para Double para compatibilidade com setDouble
    private Integer idTipoContrato;
    private Integer idTipoJornada;

    // Getters e setters

    public String getEmpresaContratante() {
        return empresaContratante;
    }

    public void setEmpresaContratante(String empresaContratante) {
        this.empresaContratante = empresaContratante;
    }

    public Date getInicio() {
        return inicio;
    }

    public void setInicio(Date inicio) {
        this.inicio = inicio;
    }

    public Date getTermino() {
        return termino;
    }

    public void setTermino(Date termino) {
        this.termino = termino;
    }

    public Integer getCargaHorariaSemanal() {
        return cargaHorariaSemanal;
    }

    public void setCargaHorariaSemanal(Integer cargaHorariaSemanal) {
        this.cargaHorariaSemanal = cargaHorariaSemanal;
    }

    public Double getValorMensal() {
        return valorMensal;
    }

    public void setValorMensal(Double valorMensal) {
        this.valorMensal = valorMensal;
    }

    public Integer getIdTipoContrato() {
        return idTipoContrato;
    }

    public void setIdTipoContrato(Integer idTipoContrato) {
        this.idTipoContrato = idTipoContrato;
    }

    public Integer getIdTipoJornada() {
        return idTipoJornada;
    }

    public void setIdTipoJornada(Integer idTipoJornada) {
        this.idTipoJornada = idTipoJornada;
    }
}