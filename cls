[1mdiff --git a/src/CSS/MainFilesCss/HomePagesCss/SliderImg.css b/src/CSS/MainFilesCss/HomePagesCss/SliderImg.css[m
[1mindex 06deca1..528e27c 100644[m
[1m--- a/src/CSS/MainFilesCss/HomePagesCss/SliderImg.css[m
[1m+++ b/src/CSS/MainFilesCss/HomePagesCss/SliderImg.css[m
[36m@@ -61,7 +61,6 @@[m
 .carousel-caption h5 {[m
     font-family: 'Playfair Display', serif;[m
     text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);[m
[31m-[m
     font-size: 45px;[m
     font-weight: 800;[m
     letter-spacing: 2px;[m
[36m@@ -112,6 +111,11 @@[m
         display: none;[m
     }[m
 [m
[32m+[m[32m    .carousel-caption{[m
[32m+[m[32m        margin-bottom: -30px;[m
[32m+[m[32m        /* background-color: red !important; */[m
[32m+[m[32m    }[m
[32m+[m
     .carousel-caption a{[m
         padding: 8px 27px;[m
         font-size: 12px;[m
[1mdiff --git a/src/CSS/MainFilesCss/header.css b/src/CSS/MainFilesCss/header.css[m
[1mindex ed662ea..d59cbbc 100644[m
[1m--- a/src/CSS/MainFilesCss/header.css[m
[1m+++ b/src/CSS/MainFilesCss/header.css[m
[36m@@ -27,13 +27,12 @@[m [mbody {[m
   color: white;[m
   padding: 5px;[m
   margin: 0;[m
[31m-  margin-top: 5px;[m
 }[m
 [m
 .upper_header_part {[m
   display: flex;[m
   align-items: center;[m
[31m-  justify-content: space-between;[m
[32m+[m[32m  justify-content: space-between;[m[41m [m
   padding: 0 2rem;[m
 }[m
 [m
[36m@@ -135,6 +134,7 @@[m [mbody {[m
   color: black;[m
   font-size: 1.5rem;[m
   transition: all 0.4s;[m
[32m+[m[32m  margin-left: -50px !important;[m
 }[m
 .cart_icon:hover{[m
   color: rgb(145, 184, 67);[m
[36m@@ -279,10 +279,7 @@[m [mbody {[m
 [m
   .headerTop {[m
     font-size: 0.8rem;[m
[31m-    margin-top: 5px;[m
   }[m
[31m-  [m
[31m-[m
   .header_search {[m
     width: 50%;[m
     padding: 0.4rem 0.4rem;[m
[36m@@ -302,9 +299,28 @@[m [mbody {[m
     font-size: 16px;[m
   }[m
   .header_search input {[m
[31m-    font-size: 14px;[m
[32m+[m[32m    font-size: 12px;[m
   }[m
 [m
[32m+[m[32m  .header_search::after {[m
[32m+[m[32m    content: "";[m
[32m+[m[32m    position: absolute;[m
[32m+[m[32m    bottom: 5px;[m
[32m+[m[32m    left: 50%;[m
[32m+[m[32m    right: 50%;[m
[32m+[m[32m    width: 0;[m
[32m+[m[32m    height: 2px;[m
[32m+[m[32m    background-color: white;[m
[32m+[m[32m    transition: width 0.8s ease, left 0.8s ease, right 0.8s ease;[m
[32m+[m[32m  }[m
[32m+[m[41m  [m
[32m+[m[32m  .header_search:hover::after {[m
[32m+[m[32m    width: 85%;[m
[32m+[m[32m    left: 3%;[m
[32m+[m[32m    right: 12%;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m
   .toggleMenuActive {[m
     width: 50%;[m
     padding: 2rem;[m
[36m@@ -316,11 +332,32 @@[m [mbody {[m
     width: 50%;[m
     padding: 0.2rem 0.2rem;[m
   }[m
[32m+[m
[32m+[m
[32m+[m[32m  .header_search::after {[m
[32m+[m[32m    content: "";[m
[32m+[m[32m    position: absolute;[m
[32m+[m[32m    bottom: 2px;[m
[32m+[m[32m    left: 50%;[m
[32m+[m[32m    right: 50%;[m
[32m+[m[32m    width: 0;[m
[32m+[m[32m    height: 2px;[m
[32m+[m[32m    background-color: white;[m
[32m+[m[32m    transition: width 0.8s ease, left 0.8s ease, right 0.8s ease;[m
[32m+[m[32m  }[m
[32m+[m[41m  [m
[32m+[m[32m  .header_search:hover::after {[m
[32m+[m[32m    width: 82%;[m
[32m+[m[32m    left: 3%;[m
[32m+[m[32m    right: 15%;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m
   .upper_header_part {[m
     padding: 0 0.5rem;[m
   }[m
   .cart_icon{[m
[31m-    font-size: 0.8rem;[m
[32m+[m[32m    font-size: 1rem;[m
   }[m
   .logo {[m
     height: 60px;[m
