/*global describe: false, it: false */
/* exported ResponsiveNav */
describe("responsive-nav", function () {

  var nav,
    selector = "navigation",
    el = document.createElement("div");

  el.className = "nav-collapse";
  el.id = selector;
  el.innerHTML = "<ul style='overflow:hidden;width:100%;height:16px;float:left;margin:0;padding:0'>" +
    "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Home</a></li>" +
    "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>About</a></li>" +
    "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Projects</a></li>" +
    "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Blog</a></li>" +
    "</ul>";

  function eventFire(el, etype) {
    if (el.fireEvent) {
      (el.fireEvent("on" + etype));
    } else {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  function insertNav() {
    document.getElementsByTagName("body")[0].appendChild(el);
    nav = responsiveNav(selector);
  }

  /**
   * Init
   */
  describe("init", function () {

    it("adds a 'js' class", function () {
      insertNav();
      expect(document.documentElement.className).toBe("js");
      nav.destroy();
    });

    it("selects the element", function () {
      spyOn(document, "getElementById").andCallThrough();
      insertNav();
      expect(document.getElementById).toHaveBeenCalledWith(selector);
      expect(nav.wrapper.id).toBe(selector);
      nav.destroy();
    });

    it("creates a toggle", function () {
      insertNav();
      expect(document.querySelector(".nav-toggle").nodeName.toLowerCase()).toBe("a");
      expect(el.className).toBe("nav-collapse closed");
      nav.destroy();
    });

    it("initializes transitions", function () {
      insertNav();
      spyOn(nav, "_transitions").andCallThrough();
      nav._transitions();
      expect(nav._transitions).toHaveBeenCalled();
      nav.destroy();
    });

    it("initializes calculations", function () {
      insertNav();
      spyOn(nav, "resize").andCallThrough();
      nav.resize();
      expect(nav.resize).toHaveBeenCalled();
      nav.destroy();
    });

    it("adds classes", function () {
      insertNav();
      expect(el.className).toBe("nav-collapse closed");
      nav.destroy();
    });

    it("should work with multiple menus", function () {
      el.innerHTML = "<ul style='display:block;width:100%;float:left;margin:0;padding:0'>" +
        "<li style='display:block;height:10px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Home</a></li>" +
        "<li style='display:block;height:10px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>About</a></li>" +
        "</ul>" +
        "<ul style='display:block;width:100%;float:left;margin:0;padding:0'>" +
        "<li style='height:10px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Home</a></li>" +
        "<li style='height:10px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>About</a></li>" +
        "<li style='height:10px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Foo</a></li>" +
        "</ul>";
      insertNav();
      var styleEl = document.getElementsByTagName("style")[0],
        styleContents = styleEl.innerHTML;
      expect(styleContents).toBe(".nav-collapse.opened{max-height:50px}");
      nav.destroy();
    });

    it("should work with multiple instances", function () {
      var el2 = document.createElement("div");
      el2.className = "nav-collapse";
      el2.id = "navigation2";
      el2.innerHTML = "<ul style='overflow:hidden;width:100%;height:16px;float:left;margin:0;padding:0'>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Home</a></li>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>About</a></li>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Projects</a></li>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Blog</a></li>" +
        "</ul>";
      document.getElementsByTagName("body")[0].appendChild(el);
      document.getElementsByTagName("body")[0].appendChild(el2);
      nav = responsiveNav(selector);
      var nav2 = responsiveNav("#navigation2");
      expect(el.className).toBe("nav-collapse closed");
      expect(el2.className).toBe("nav-collapse closed");
      nav.destroy();
      nav2.destroy();
    });

  });

  /**
   * destroy
   */
  describe("destroy", function () {

    it("destroys Responsive Nav", function () {
      insertNav();
      nav.destroy();
      expect(el.className).not.toBe("nav-collapse closed");
      expect(el.className).not.toBe("nav-collapse opened");
      expect(el.className).not.toBe("nav-collapse");
      expect(document.querySelector(".nav-toggle")).toBe(null);
      expect(el.style.position).toBe("");
      expect(el.style.maxHeight).toBe("");
      expect(el.getAttribute("aria-hidden")).not.toBe("true");
      expect(el.getAttribute("aria-hidden")).not.toBe("false");
    });

  });

  /**
   * toggle
   */
  describe("toggle", function () {

    it("toggles the navigation open and close", function () {
      insertNav();
      spyOn(nav, "toggle").andCallThrough();
      nav.toggle();
      expect(nav.toggle).toHaveBeenCalled();
      expect(el.className).toBe("nav-collapse opened");
      expect(el.getAttribute("aria-hidden")).toBe("false");
      expect(el.style.position).toBe("relative");
      nav.destroy();
    });

  });

  /**
   * handleEvent
   */
  describe("handleEvent", function () {

    it("toggles the navigation on touchend", function () {
      insertNav();
      var toggle = document.querySelector(".nav-toggle");
      eventFire(toggle, "touchend");
      expect(el.className).toBe("nav-collapse opened");
      nav.destroy();
    });

    it("toggles the navigation on mouseup", function () {
      insertNav();
      var toggle = document.querySelector(".nav-toggle");
      eventFire(toggle, "mouseup");
      expect(el.className).toBe("nav-collapse opened");
      nav.destroy();
    });

  });

  /**
   * Resize
   */
  describe("resize", function () {

    it("calculates the height of the navigation", function () {
      el.innerHTML = "<ul style='overflow:hidden;width:100%;height:16px;float:left;margin:0;padding:0'>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Home</a></li>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>About</a></li>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Projects</a></li>" +
        "<li style='height:4px;overflow:hidden;width:100%;float:left;margin:0;padding:0'><a href='#'>Blog</a></li>" +
        "</ul>";
      insertNav();
      var styleEl = document.getElementsByTagName("style")[0],
        styleContents = styleEl.innerHTML;
      expect(styleContents).toBe(".nav-collapse.opened{max-height:16px}");
      nav.destroy();
    });

  });

  /**
   * options
   */
  describe("options", function () {

    it("turns off animation if needed", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      nav = responsiveNav("#" + selector, { animate: false });
      expect(el.style.transition).toBe(undefined);
      nav.destroy();
    });

    it("controls the transition speed", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      nav = responsiveNav("#" + selector, { transition: "666" });
      expect(el.style.transition).toBe("max-height 666ms");
      nav.destroy();
    });

    it("changes the toggle's text", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      nav = responsiveNav("#" + selector, { label: "foobar" });
      expect(document.querySelector(".nav-toggle").innerHTML).toBe("foobar");
      nav.destroy();
    });

    it("'changes the location where toggle is inserted", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      nav = responsiveNav("#" + selector, { insert: "before" });
      expect(document.querySelector(".nav-toggle").nextSibling).toBe(el);
      nav.destroy();
    });

    it("allows users to specify their own toggle", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      var button = document.createElement("button");
      button.id = "button";
      document.getElementsByTagName("body")[0].appendChild(button);
      nav = responsiveNav("#" + selector, { customToggle: "button" });
      expect(document.getElementById("button").getAttribute("aria-hidden")).toBeDefined();
      nav.destroy();
    });

    it("allows users to specify custom open position", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      nav = responsiveNav("#" + selector, { openPos: "static" });
      nav.toggle();
      expect(el.style.position).toBe("static");
      nav.destroy();
    });

    it("allows users to specify custom JS class", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      nav = responsiveNav("#" + selector, { jsClass: "foobar" });
      expect(document.documentElement.className).toBe("js foobar");
      nav.destroy();
    });

    it("allows users to have init callback", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      var foo = "bar";
      nav = responsiveNav("#" + selector, {
        init: function () { foo = "biz"; }
      });
      expect(foo).toBe("biz");
      nav.destroy();
    });

    it("allows users to have open callback", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      var foo = "bar";
      nav = responsiveNav("#" + selector, {
        open: function () { foo = "biz"; }
      });
      nav.toggle();
      expect(foo).toBe("biz");
      nav.destroy();
    });

    it("allows users to have close callback", function () {
      document.getElementsByTagName("body")[0].appendChild(el);
      var foo = "bar";
      nav = responsiveNav("#" + selector, {
        close: function () { foo = "biz"; }
      });
      nav.toggle();
      nav.toggle();
      expect(foo).toBe("biz");
      nav.destroy();
    });

  });

});
