import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { blogs } from '../../fixtures/blogs';

const hexrgb = require('hexrgb');

/**
 * Tests
 */

test('it renders', function(assert) {
    this.set('_blogs', []);
    this.render(hbs`{{gh-switcher blogs=_blogs}}`);
    assert.equal(this.$().text().trim(), '+');
});

test('it renders all blogs as single-letter buttons', function(assert) {
    this.set('_blogs', blogs);

    // Ensure the blogs all have a predictable name, despite integration testing
    blogs.forEach((blog) => {
        blog.set('name', 'Testblog');
    });

    this.render(hbs`{{gh-switcher blogs=_blogs}}`);
    let expected = (process.platform === 'darwin') ? 'T⌘1T⌘2T⌘3+' : 'TCtrl1TCtrl2TCtrl3+';

    assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r| )/gm, ''), expected);
});

test('it renders all blogs with a colored icon background', function(assert) {
    this.set('_blogs', blogs);
    this.render(hbs`{{gh-switcher blogs=_blogs}}`);

    this.$('.switcher-blogs .switch-btn').each((index, element) => {

        // jQuery returns CSS colors as RGBA computed values; must convert
        // to HEX to be able to compare them.
        assert.equal(
            hexrgb.rgb2hex(this.$(element).css("background-color")),
            blogs[index].iconColor
        );
    });
});

test('it renders all blogs with the id in the data attribute', function(assert) {
    this.set('_blogs', blogs);
    this.render(hbs`{{gh-switcher blogs=_blogs}}`);
    assert.equal(this.$('.switch-btn').data('blog'), 0);
});

test('a click on a blog initiates blog navigation', function(assert) {
    this.set('_blogs', blogs);
    this.set('_switchToBlog', (blog) => {
        assert.equal(blog, blogs[0], 'clicked blog is passed to switchToBlog action');
    });

    this.render(hbs`{{gh-switcher blogs=_blogs switchToBlog=(action _switchToBlog)}}`);
    this.$('.switch-btn')[0].click();
});

test('a click on the "add blog" sign requests "add blog" ui', function(assert) {
    this.set('_blogs', blogs);
    this.set('_showAddBlog', () => {
        // We just ensure that the assert is called
        assert.ok(true);
    });

    this.render(hbs`{{gh-switcher blogs=_blogs showAddBlog=(action _showAddBlog)}}`);
    this.$('.add-blog-button').click();
});
