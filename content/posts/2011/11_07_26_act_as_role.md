+++
title = 'acts_as_role'
date = 2011-07-26T00:00:00+01:00
draft = false
tags = ['rails', 'ruby']
+++

= acts_as_role

This is a minimalist implementation of roles using a database column to store the roles in plain text. You can specify the role values and a default role that should be used when model is initialized.

```ruby	
  class User < ActiveRecord::Base
    acts_as_role :role, :values = %w(admin owner user), :default => :user
  end
```  

Use role field to store the user roles. 

```ruby
  user = User.new
  user.role => "user"
  user.has_role?(:user) => true 
```

Test roles using has_#{role_column.singularize}? or has_#{role_column.pluralize}? 

```ruby
  user.has_roles?(:user, :admin) => false

  user.add_roles :owner
  user.has_roles?(:user, :owner) => true
```

Roles are stored using plain text

```ruby
  user.roles => "user_owner"

  user.remove_roles(:user)
  user.has_role?(:user) => false
  user.roles => "owner"
```

Validation - internally there is a roles validator, you can add a :message to customize the validation message

```ruby
  user.add_roles :not_specified
  user.valid? => false
  user.errors[:roles] => "contains an invalid role"
```
You can use a different field with different syntax

```ruby
  class Access < ActiveRecord::Base  
    acts_as_role :flag, :values => %w(owner manager employee), :message => "invalid role"
  end

  access = Access.new
  access.flag => "" (no default role specified)
  access.add_flags(:owner)
  access.has_flag?(:owner) => true
  access.add_flags(:manager)
  access.has_flags?(:manager, :owner) => true
  access.flag => manager_owner
  access.add_flags :invalid
  access.valid? => false
  access.errors[:flag] => "invalid role"
```

Also you can use is_role to query a custom role

```ruby
  user = User.new
  user.is_user? => true
  user.is_admin? => false

  access = Access.new
  access.is_owner? => false
  access.is_manager? => false
  access.add_roles :manager
  access.is_manager? => true
```

== Contributing to acts_as_roles
 
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.
* Please try not to mess with the Rakefile, version, or history. If you want to have your own version, or is otherwise necessary, that is fine, but please isolate to its own commit so I can cherry-pick around it.
