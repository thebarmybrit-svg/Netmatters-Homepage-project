<div class="latest-articles">
    <div class="container">
        <div class="row">
            <div class="article headings-container clearfix">
                <h2 class="h1 float-left-sm">
                    Latest News
                </h2>                         
                <a class="h2 float-right-sm hidden-xs" href="#">
                    View All
                    <em class="icon icon-arrow-right2"></em>
                </a>
            </div>
            <!-- views/partials/latest_articles.php -->
            <?php if (!empty($articles) && (is_array($articles) || is_object($articles))): ?>
                <?php foreach ($articles as $article): ?>
                    <div class="article">
                        <div class="item <?php echo htmlspecialchars($article['category_name'] === 'Careers' ? 'it' : 'software'); ?>">
                            <a class="article-link" href="<?php echo htmlspecialchars($article['link']); ?>"></a>
                            <div class="img-content-container">
                                <a class="category <?php echo htmlspecialchars($article['category_name'] === 'Careers' ? 'btn--it-supp' : 'btn--cons-dev'); ?>" 
                                href="<?php echo htmlspecialchars($article['category_link']); ?>" 
                                title="<?php echo htmlspecialchars($article['category_title']); ?>">
                                    <?php echo htmlspecialchars($article['category_name']); ?>
                                </a>
                                <a class="img-container" href="<?php echo htmlspecialchars($article['link']); ?>">
                                    <img class="img--standard" 
                                        src="<?php echo htmlspecialchars($article['image_src']); ?>" 
                                        alt="<?php echo htmlspecialchars($article['image_alt']); ?>">
                                </a>
                            </div>
                            <div class="block">
                                <h3>
                                    <a href="<?php echo htmlspecialchars($article['link']); ?>">
                                        <?php echo htmlspecialchars($article['title']); ?>
                                    </a>
                                </h3>
                                <p><?php echo htmlspecialchars($article['excerpt']); ?></p>
                                <a class="btn <?php echo htmlspecialchars($article['category_name'] === 'Careers' ? 'btn--it-supp' : 'btn--star-full'); ?>" 
                                href="<?php echo htmlspecialchars($article['link']); ?>">
                                    Read More
                                </a>
                                <div class="user">
                                    <div class="img-content-container">
                                        <img class="img--avatar" 
                                            src="<?php echo htmlspecialchars($article['author_avatar']); ?>" 
                                            alt="<?php echo htmlspecialchars($article['author_name']); ?>">
                                    </div>
                                    <div class="details">
                                        <strong>Posted by <?php echo htmlspecialchars($article['author_name']); ?></strong>
                                        <br>
                                        <?php 
                                            // Formats '2025-06-27' to '27th June 2025'
                                            echo date('jS F Y', strtotime($article['date'])); 
                                        ?>
                                    </div>
                                </div>
                            </div>  
                        </div>                                
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No recent articles found.</p>
            <?php endif; ?>
            
            <div class="article hidden-sm hidden-md hidden-lg">
                <h3>
                    <a href="#">
                        View all
                        <em class="icon icon-arrow-right2"></em>
                    </a>
                </h3>
            </div>
        </div>
    </div>
</div>