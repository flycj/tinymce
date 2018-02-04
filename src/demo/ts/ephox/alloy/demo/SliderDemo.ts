import Behaviour from 'ephox/alloy/api/behaviour/Behaviour';
import Keying from 'ephox/alloy/api/behaviour/Keying';
import Replacing from 'ephox/alloy/api/behaviour/Replacing';
import Toggling from 'ephox/alloy/api/behaviour/Toggling';
import GuiFactory from 'ephox/alloy/api/component/GuiFactory';
import Gui from 'ephox/alloy/api/system/Gui';
import Container from 'ephox/alloy/api/ui/Container';
import Slider from 'ephox/alloy/api/ui/Slider';
import HtmlDisplay from 'ephox/alloy/demo/HtmlDisplay';
import { Fun } from '@ephox/katamari';
import { PlatformDetection } from '@ephox/sand';
import { Insert } from '@ephox/sugar';
import { DomEvent } from '@ephox/sugar';
import { Element } from '@ephox/sugar';
import { Class } from '@ephox/sugar';
import { Css } from '@ephox/sugar';



export default <any> function () {
  var gui = Gui.create();
  var body = Element.fromDom(document.body);
  Class.add(gui.element(), 'gui-root-demo-container');
  Insert.append(body, gui.element());

  var slider1 = HtmlDisplay.section(
    gui,
    'This is a basic slider from [20, 100] with snapping to grid at 10',
    Slider.sketch({
      dom: {
        tag: 'div'
      },
      min: 20,
      max: 100,
      getInitialValue: Fun.constant(80),
      stepSize: 10,
      snapToGrid: true,

      components: [
        Slider.parts().spectrum({
          dom: {
            tag: 'div',
            styles: {
              height: '20px',
              background: 'blue',
              outline: '4px solid green'
            }
          }
        }),
        Slider.parts().thumb({
          dom: {
            tag: 'div',
            styles: {
              height: '30px',
              width: '10px',
              top: '0px',
              background: 'black',
              'padding-top': '-5px'
            }
          }
        })
      ]
    })
  );

  var slider2 = HtmlDisplay.section(
    gui,
    'This is a basic slider with two snapping regions [35] and [75]. The minimum value is 0',
    Slider.sketch({
      dom: { tag: 'div', styles: { 'margin-bottom': '40px' } },

      min: 0,
      max: 100,
      getInitialValue: Fun.constant(35),
      stepSize: 40,
      snapStart: 35,
      snapToGrid: true,
      onDragStart: function (_, thumb) { Toggling.on(thumb); },
      onDragEnd: function (_, thumb) { Toggling.off(thumb); },

      onInit: function (slider, thumb, value) {
        Replacing.set(thumb, [
          GuiFactory.text(value)
        ]);
      },

      onChange: function (slider, thumb, value) {
        Replacing.set(thumb, [
          GuiFactory.text(value)
        ]);
      },

      components: [
        Slider.parts().spectrum({
          dom: {
            tag: 'div',
            styles: {
              width: '300px', background: 'green', height: '20px'
            }
          }
        }),
        Slider.parts().thumb({
          dom: {
            tag: 'div',
            styles: {
              'border-radius': '20px',
              width: '25px',
              height: '25px',
              'border': '1px solid green',
              background: 'transparent',
              display: 'flex', 'align-items': 'center', 'justify-content': 'center'
            }
          },
          behaviours: Behaviour.derive([
            Replacing.config({ }),
            Toggling.config({
              toggleClass: 'thumb-pressed'
            })
          ])
        })
      ]
    })
  );

  var hueSlider = HtmlDisplay.section(
    gui,
    'This is a basic color slider with a sliding thumb and edges',
    Slider.sketch({
      dom: {
        tag: 'div',
        styles: {
          border: '1px solid black'
        }
      },
      min: 0,
      max: 360,
      getInitialValue: Fun.constant(120),
      stepSize: 10,

      onChange: function (slider, thumb, value) {
        var getColor = function (hue) {
          if (hue < 0) return 'black';
          else if (hue > 360) return 'white';
          else return 'hsl(' + hue + ', 100%, 50%)';
        };

        Css.set(thumb.element(), 'background', getColor(value));
      },

      // TODO: Remove duplication in demo.
      onInit: function (slider, thumb, value) {
        var getColor = function (hue) {
          if (hue < 0) return 'black';
          else if (hue > 360) return 'white';
          else return 'hsl(' + hue + ', 100%, 50%)';
        };

        Css.set(thumb.element(), 'background', getColor(value));
      },

      components: [
        Container.sketch({
          dom: {
            tag: 'div',
            styles: {
              display: 'flex'
            }
          },
          components: [
            Slider.parts()['left-edge']({
              dom: {
                tag: 'div',
                styles: {
                  'width': '120px',
                  height: '20px',
                  background: 'black'
                }
              }
            }),
            Slider.parts().spectrum({
              dom: {
                tag: 'div',
                styles: {
                  height: '20px',
                  background: 'linear-gradient(to right, hsl(0, 100%, 50%) 0%, hsl(60, 100%, 50%) 17%, hsl(120, 100%, 50%) 33%, hsl(180, 100%, 50%) 50%, hsl(240, 100%, 50%) 67%, hsl(300, 100%, 50%) 83%, hsl(360, 100%, 50%) 100%)',
                  display: 'flex',
                  'flex-grow': '1'
                }
              }
            }),
            Slider.parts()['right-edge']({
              dom: {
                tag: 'div',
                styles: {
                  'width': '120px',
                  height: '20px',
                  background: 'white'
                }
              }
            })
          ]
        }),
        Slider.parts().thumb({
          dom: {
            tag: 'div',
            classes: [ 'demo-sliding-thumb' ],
            styles: {
              height: '30px',
              width: '10px',
              top: '0px',
              background: 'black',
              'padding-top': '-5px',
              border: '1px solid black',
              outline: '1px solid white'
            }
          }
        })
      ]
    })
  );

  var platform = PlatformDetection.detect();
  var isTouch = platform.deviceType.isTouch();

  DomEvent.bind(body, 'click', function () {
    if (! isTouch) Keying.focusIn(slider1);
  });
};