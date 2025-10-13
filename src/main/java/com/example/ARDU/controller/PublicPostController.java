
package com.example.ARDU.controller;


import com.example.ARDU.entity.Comment;
import com.example.ARDU.entity.Post;
import com.example.ARDU.entity.Reaction;
import com.example.ARDU.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/posts")
public class PublicPostController {

    private final PostService postService;

    public PublicPostController(PostService postService) {
        this.postService = postService;
    }

    // @ModelAttribute is required to correctly bind the MultipartFile from the
    // request


    @GetMapping
    public ResponseEntity<List<Post>> getAllPostsPublic() {
        return ResponseEntity.ok(postService.getAllVisiblePosts());
    }






    @GetMapping("/{postId}/comments")
    public ResponseEntity<Page<Comment>> getPublicComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getComments(postId, page, size));
    }

    @GetMapping("/{postId}/reactions")
    public ResponseEntity<Page<Reaction>> getPublicReactions(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getReactions(postId, page, size));
    }


}