-- Add feature images to existing blog posts
-- Each image is from Unsplash (free to use, high-quality stock photography)

DO $$
BEGIN
  -- Post 1: Why Your Small Business Website Is Costing You Customers
  -- Image: Modern laptop with website on screen
  UPDATE posts
  SET cover_image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'
  WHERE slug = 'why-your-small-business-website-costs-customers';

  IF FOUND THEN
    RAISE NOTICE 'Updated cover image for post 1';
  ELSE
    RAISE NOTICE 'Post 1 not found';
  END IF;

  -- Post 2: How Local Service Businesses Use AI Agents to Capture Better Leads
  -- Image: Abstract AI/technology with glowing circuits
  UPDATE posts
  SET cover_image = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80'
  WHERE slug = 'local-service-businesses-ai-agents-capture-leads-after-hours';

  IF FOUND THEN
    RAISE NOTICE 'Updated cover image for post 2';
  ELSE
    RAISE NOTICE 'Post 2 not found';
  END IF;

  -- Post 3: Stop Copying and Pasting: How Connected Systems Save 15+ Hours
  -- Image: Connected network/abstract workflow
  UPDATE posts
  SET cover_image = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'
  WHERE slug = 'stop-copying-pasting-connected-systems-save-hours';

  IF FOUND THEN
    RAISE NOTICE 'Updated cover image for post 3';
  ELSE
    RAISE NOTICE 'Post 3 not found';
  END IF;
END $$;
