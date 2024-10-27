package com.canvas.back.canvas.DTO;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.PathVariable;
@Setter
@Getter
public class CanvasHeader {
    private String workspace_id;
    private String conversation_id;
    private String canvas_id;

    @Override
    public String toString() {
        return "canvas:" + workspace_id + ":" + conversation_id + ":" + canvas_id;
    }
}

