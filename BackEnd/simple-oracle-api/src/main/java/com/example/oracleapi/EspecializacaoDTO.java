package com.example.oracleapi;

public class EspecializacaoDTO {
    private String id; // Use String if IDs are stored as text in DB
    private String nome;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public EspecializacaoDTO(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    // Getters and setters
}
