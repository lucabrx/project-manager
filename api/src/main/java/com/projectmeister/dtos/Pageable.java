package com.projectmeister.dtos;

import jakarta.ws.rs.QueryParam;

public class Pageable {
    @QueryParam("page")
    private int page = 0;
    @QueryParam("size")
    private int size = 20;
    @QueryParam("sort")
    private String sort;
    @QueryParam("search")
    private String search;
    @QueryParam("order")
    private String order;

    public Pageable() {}

    public Pageable(int page, int size, String sort, String search, String order) {
        this.page = page;
        this.size = size;
        this.sort = sort;
        this.search = search;
        this.order = order;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }
}
