package com.example.oracleapi;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

import java.util.Date;

public class ContratoDTO {

    private String empresaContratante;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date inicio;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date termino; // When null, that's OK.

    private Integer cargaHorariaSemanal;
    private Double valorMensal;
    private Integer idTipoContrato;
    private Integer idTipoJornada;

    private Integer status;

    // Getters e setters

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

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